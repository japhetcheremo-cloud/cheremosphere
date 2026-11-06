from django.urls import path
from .views import (
    JobCategoryListView, JobVacancyListView, JobVacancyDetailView,
    EmployerJobVacanciesView, JobApplicationCreateView, MyApplicationsView,
    VacancyApplicantsListView, ApplicationStatusUpdateView,
    SaveJobToggleView, SavedJobsListView
)

urlpatterns = [
    path('categories/', JobCategoryListView.as_view(), name='job-categories'),
    path('vacancies/', JobVacancyListView.as_view(), name='job-vacancies-list'),
    path('vacancies/<int:pk>/', JobVacancyDetailView.as_view(), name='job-vacancy-detail'),
    path('employer/vacancies/', EmployerJobVacanciesView.as_view(), name='employer-vacancies'),
    path('applications/apply/', JobApplicationCreateView.as_view(), name='job-apply'),
    path('applications/my/', MyApplicationsView.as_view(), name='my-applications'),
    path('vacancies/<int:vacancy_id>/applicants/', VacancyApplicantsListView.as_view(), name='vacancy-applicants'),
    path('applications/<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application-status-update'),
    path('vacancies/<int:vacancy_id>/save/', SaveJobToggleView.as_view(), name='save-job-toggle'),
    path('saved/', SavedJobsListView.as_view(), name='saved-jobs-list'),
]
