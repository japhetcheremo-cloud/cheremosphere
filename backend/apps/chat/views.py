from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from accounts.models import User
from notifications.models import Notification


class ConversationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(participants=request.user).prefetch_related('participants', 'messages')
        serializer = ConversationSerializer(conversations, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        recipient_id = request.data.get('recipient_id')
        if not recipient_id:
            return Response({'error': 'recipient_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)

        if recipient == request.user:
            return Response({'error': 'Cannot chat with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Check existing 1-on-1 conversation
        conv = Conversation.objects.filter(participants=request.user).filter(participants=recipient).first()
        if not conv:
            subject = request.data.get('subject', '')
            conv = Conversation.objects.create(subject=subject)
            conv.participants.add(request.user, recipient)

        initial_message = request.data.get('message', '').strip()
        if initial_message:
            Message.objects.create(
                conversation=conv,
                sender=request.user,
                text=initial_message
            )
            Notification.objects.create(
                recipient=recipient,
                sender=request.user,
                notification_type='message',
                title=f'Message from {request.user.get_full_name() or request.user.username}',
                message=initial_message[:100],
                action_url=f'/chat/{conv.id}'
            )

        serializer = ConversationSerializer(conv, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Mark incoming messages as read
        instance.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        messages = instance.messages.all().select_related('sender')
        return Response({
            'conversation': ConversationSerializer(instance, context={'request': request}).data,
            'messages': MessageSerializer(messages, many=True).data
        })


class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, conversation_id):
        try:
            conv = Conversation.objects.get(id=conversation_id, participants=request.user)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)

        text = request.data.get('text', '').strip()
        if not text and not request.FILES.get('attachment'):
            return Response({'error': 'Message text or attachment required'}, status=status.HTTP_400_BAD_REQUEST)

        msg = Message.objects.create(
            conversation=conv,
            sender=request.user,
            text=text,
            attachment=request.FILES.get('attachment')
        )
        conv.save()  # update updated_at

        # Send notification to other participants
        for participant in conv.participants.exclude(id=request.user.id):
            Notification.objects.create(
                recipient=participant,
                sender=request.user,
                notification_type='message',
                title=f'Message from {request.user.get_full_name() or request.user.username}',
                message=text[:100] if text else 'Sent an attachment',
                action_url=f'/chat/{conv.id}'
            )

        return Response(MessageSerializer(msg).data, status=status.HTTP_201_CREATED)
