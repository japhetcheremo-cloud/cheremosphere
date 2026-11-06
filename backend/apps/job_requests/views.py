from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import JobRequest
from .serializers import JobRequestSerializer


class JobRequestListView(generics.ListCreateAPIView):
    serializer_class = JobRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = JobRequest.objects.filter(is_active=True).select_related('user')
        search = self.request.query_params.get('search', '').strip()
        location = self.request.query_params.get('location', '').strip()
        category = self.request.query_params.get('category', '').strip()
        employment_type = self.request.query_params.get('type', '').strip()
        fulfilled = self.request.query_params.get('fulfilled', '')

        if search:
            queryset = queryset.filter(
                Q(job_sought__icontains=search) |
                Q(skills__icontains=search) |
                Q(personal_introduction__icontains=search) |
                Q(qualifications__icontains=search)
            )
        if location:
            queryset = queryset.filter(preferred_location__icontains=location)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)
        if fulfilled == 'false':
            queryset = queryset.filter(is_fulfilled=False)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_job_seeker:
            user.is_job_seeker = True
            user.save()
        serializer.save(user=user)


class JobRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobRequest.objects.all()
    serializer_class = JobRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_update(self, serializer):
        if self.request.user != self.get_object().user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only edit your own job requests.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only delete your own job requests.")
        instance.delete()


class MyJobRequestsView(generics.ListAPIView):
    serializer_class = JobRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobRequest.objects.filter(user=self.request.user).order_by('-created_at')


class MarkJobRequestFulfilledView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            req = JobRequest.objects.get(pk=pk, user=request.user)
        except JobRequest.DoesNotExist:
            return Response({'error': 'Job request not found'}, status=status.HTTP_404_NOT_FOUND)

        req.is_fulfilled = not req.is_fulfilled
        req.save()
        return Response({
            'id': req.id,
            'is_fulfilled': req.is_fulfilled,
            'message': 'Job request marked as fulfilled!' if req.is_fulfilled else 'Job request marked as active.'
        })
