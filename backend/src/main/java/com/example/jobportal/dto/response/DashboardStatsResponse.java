package com.example.jobportal.dto.response;

public class DashboardStatsResponse {
    private long totalUsers;
    private long totalSeekers;
    private long totalEmployers;
    private long totalCompanies;
    private long totalJobs;
    private long activeJobs;
    private long pendingJobs;
    private long totalApplications;
    private long shortlistedApplications;
    private long selectedApplications;

    public DashboardStatsResponse() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalSeekers() { return totalSeekers; }
    public void setTotalSeekers(long totalSeekers) { this.totalSeekers = totalSeekers; }

    public long getTotalEmployers() { return totalEmployers; }
    public void setTotalEmployers(long totalEmployers) { this.totalEmployers = totalEmployers; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }

    public long getPendingJobs() { return pendingJobs; }
    public void setPendingJobs(long pendingJobs) { this.pendingJobs = pendingJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getShortlistedApplications() { return shortlistedApplications; }
    public void setShortlistedApplications(long shortlistedApplications) { this.shortlistedApplications = shortlistedApplications; }

    public long getSelectedApplications() { return selectedApplications; }
    public void setSelectedApplications(long selectedApplications) { this.selectedApplications = selectedApplications; }
}
