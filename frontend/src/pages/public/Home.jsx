import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import JobCard from '../../components/JobCard';
import CompanyCard from '../../components/CompanyCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { jobService } from '../../services/jobService';
import { companyService } from '../../services/companyService';
import { 
  BiSearch, BiBuilding, BiUserCheck, BiBriefcase, BiCheckShield, 
  BiRocket, BiBrain, BiCodeAlt, BiCloud, BiPalette, BiCheckCircle,
  BiTrendingUp, BiChevronRight, BiShieldQuarter, BiStar, BiTargetLock
} from 'react-icons/bi';

const Home = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, catRes, compRes] = await Promise.all([
          jobService.getJobs({ page: 0, size: 6, sortBy: 'createdAt' }),
          jobService.getCategories(),
          companyService.getAllCompanies({ page: 0, size: 4 })
        ]);
        setFeaturedJobs(jobsRes.data?.content || []);
        setCategories(catRes.data || []);
        setTopCompanies(compRes.data?.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = ({ keyword, location }) => {
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="home-page overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero-section bg-slate-950 text-white py-5 position-relative overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3.5 py-1.5 fw-semibold mb-3">
                <BiRocket className="fs-5 text-primary" /> #1 Next-Gen Tech Hiring & Career Platform
              </div>
              <h1 className="display-4 fw-extrabold text-white mb-3 leading-tight">
                Find Your Dream <span className="text-gradient-primary">Tech Role</span> & Fast-Track Your Career
              </h1>
              <p className="lead text-slate-300 mb-4 me-lg-4">
                Discover thousands of verified tech openings from top tech startups and global leaders. Experience live application tracking and direct employer recruitment pipelines.
              </p>

              {/* Main Search Bar */}
              <div className="mb-4">
                <SearchBar onSearch={handleSearchSubmit} />
              </div>

              {/* Popular Search Tags */}
              <div className="d-flex align-items-center flex-wrap gap-2 mt-3 text-slate-400 small">
                <span className="fw-semibold text-slate-300">Trending Searches:</span>
                {['Java Developer', 'React Architect', 'Spring Boot', 'Remote Roles', 'Full Stack'].map((tag) => (
                  <button
                    key={tag}
                    className="btn btn-slate-800 text-slate-300 btn-sm rounded-pill border border-slate-700 hover-bg-primary hover-text-white px-3 extra-small fw-medium"
                    onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-preview-card bg-slate-900 border border-slate-800 rounded-5 p-4 shadow-2xl position-relative">
                {/* Live Candidate Status Widget */}
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-slate-800">
                  <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center shadow-lg" style={{ width: 56, height: 56 }}>
                    <BiUserCheck className="fs-2" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-white">25,000+ Verified Candidates</h5>
                    <p className="text-slate-400 small mb-0">Hired at Fortune 500 & Unicorn Startups</p>
                  </div>
                </div>

                {/* Floating Preview Job Cards */}
                <div className="bg-slate-950 border border-slate-800 rounded-4 p-3 mb-3 d-flex align-items-center justify-content-between shadow-sm">
                  <div>
                    <span className="badge bg-success-subtle text-success mb-1 extra-small">Live Application Tracking</span>
                    <h6 className="fw-bold text-white mb-0 small">Senior Java Full Stack Engineer</h6>
                    <span className="text-slate-400 extra-small">TechCorp Systems • Chennai</span>
                  </div>
                  <span className="fw-extrabold text-primary small">₹16.5L PA</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-4 p-3 d-flex align-items-center justify-content-between shadow-sm">
                  <div>
                    <span className="badge bg-info-subtle text-info mb-1 extra-small">Full Remote</span>
                    <h6 className="fw-bold text-white mb-0 small">Lead React UI Developer</h6>
                    <span className="text-slate-400 extra-small">Innovate Global • Bengaluru</span>
                  </div>
                  <span className="fw-extrabold text-primary small">₹14.0L PA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Key Stats Bar */}
      <section className="bg-white py-4 shadow-sm border-bottom">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="bg-primary-subtle text-primary rounded-circle p-3">
                  <BiBriefcase className="fs-2" />
                </div>
                <div className="text-start">
                  <h3 className="fw-extrabold mb-0 text-dark">12,500+</h3>
                  <p className="text-muted mb-0 small fw-semibold">Active Verified Postings</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 border-start-md border-end-md">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="bg-success-subtle text-success rounded-circle p-3">
                  <BiBuilding className="fs-2" />
                </div>
                <div className="text-start">
                  <h3 className="fw-extrabold mb-0 text-dark">4,800+</h3>
                  <p className="text-muted mb-0 small fw-semibold">Top Hiring Tech Companies</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="bg-purple-subtle text-purple rounded-circle p-3">
                  <BiUserCheck className="fs-2" />
                </div>
                <div className="text-start">
                  <h3 className="fw-extrabold mb-0 text-dark">35,000+</h3>
                  <p className="text-muted mb-0 small fw-semibold">Successful Candidates Hired</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <span className="text-primary fw-bold text-uppercase extra-small tracking-wider">Targeted Specializations</span>
              <h2 className="fw-extrabold text-dark mb-0">Browse By Industry Category</h2>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary rounded-pill px-4 fw-semibold">
              Explore All Categories <BiChevronRight />
            </Link>
          </div>

          <div className="row g-4">
            {categories.slice(0, 6).map((cat, idx) => (
              <div key={cat.id || idx} className="col-lg-4 col-md-6">
                <div 
                  className="card border-0 shadow-sm rounded-4 p-4 h-100 hover-lift transition-all cursor-pointer bg-white"
                  onClick={() => navigate(`/jobs?categoryId=${cat.id}`)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary-subtle text-primary rounded-4 p-3 d-flex align-items-center justify-content-center fs-2" style={{ width: 54, height: 54 }}>
                      {idx % 4 === 0 ? <BiCodeAlt /> : idx % 4 === 1 ? <BiBrain /> : idx % 4 === 2 ? <BiCloud /> : <BiPalette />}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">{cat.name}</h5>
                      <p className="text-muted small mb-0">{cat.description || 'Explore top engineering roles'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured High-Paying Jobs */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <span className="text-primary fw-bold text-uppercase extra-small tracking-wider">Top Engineering Roles</span>
              <h2 className="fw-extrabold text-dark mb-0">Featured Job Openings</h2>
            </div>
            <Link to="/jobs" className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">
              View All Openings <BiChevronRight />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching verified high-paying jobs..." />
          ) : (
            <div className="row g-4">
              {featuredJobs.map((job) => (
                <div key={job.id} className="col-lg-4 col-md-6">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-slate-900 text-white">
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1.5 fw-semibold mb-2">Simplified Hiring</span>
            <h2 className="fw-extrabold text-white mb-2">How CareerHub Works</h2>
            <p className="text-slate-400">Streamlined process designed for both ambitious job seekers and top enterprise employers.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-slate-950 border border-slate-800 rounded-4 p-4 h-100 text-center">
                <div className="bg-primary text-white rounded-circle fs-3 fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>1</div>
                <h5 className="fw-bold text-white mb-2">Create Professional Profile</h5>
                <p className="text-slate-400 small mb-0">Build your candidate profile, add skills, and upload your resume in one click.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-slate-950 border border-slate-800 rounded-4 p-4 h-100 text-center">
                <div className="bg-primary text-white rounded-circle fs-3 fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>2</div>
                <h5 className="fw-bold text-white mb-2">Apply in One Click</h5>
                <p className="text-slate-400 small mb-0">Browse curated roles, apply instantly with attached resume, and add cover letters.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-slate-950 border border-slate-800 rounded-4 p-4 h-100 text-center">
                <div className="bg-primary text-white rounded-circle fs-3 fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>3</div>
                <h5 className="fw-bold text-white mb-2">Track Kanban Recruitment</h5>
                <p className="text-slate-400 small mb-0">Monitor your application status live through Under Review, Shortlisted, and Interview stages.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Hiring Companies */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1.5 fw-semibold mb-2">Enterprise Partners</span>
            <h2 className="fw-extrabold text-dark mb-2">Top Hiring Companies</h2>
            <p className="text-muted">Discover verified employers actively building world-class engineering teams.</p>
          </div>

          <div className="row g-4">
            {topCompanies.map((comp) => (
              <div key={comp.id} className="col-lg-3 col-md-6">
                <CompanyCard company={comp} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-5 bg-primary text-white text-center position-relative">
        <div className="container py-4">
          <h2 className="display-6 fw-extrabold mb-3">Ready to Accelerate Your Career?</h2>
          <p className="lead mb-4 max-w-xl mx-auto opacity-90">
            Join thousands of developers and tech professionals landing high-growth positions at top companies today.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register?role=JOB_SEEKER" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow-lg">
              Get Started as Job Seeker
            </Link>
            <Link to="/register?role=EMPLOYER" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold">
              Post a Job Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
