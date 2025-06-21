import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUniversalAuth';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  UserGroupIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  CheckIcon,
  StarIcon,
  PlayIcon,
  BoltIcon,
  ShieldCheckIcon,
  CursorArrowRaysIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const { user } = useUser();
  const [animatedCounts, setAnimatedCounts] = useState({
    users: 0,
    applications: 0,
    timeSaved: 0,
    successRate: 0
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animate counters on mount
  useEffect(() => {
    const targets = { users: 15000, applications: 75000, timeSaved: 2500, successRate: 95 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedCounts({
        users: Math.floor(targets.users * easeOut),
        applications: Math.floor(targets.applications * easeOut),
        timeSaved: Math.floor(targets.timeSaved * easeOut),
        successRate: Math.floor(targets.successRate * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedCounts(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <CursorArrowRaysIcon className="h-8 w-8" />,
      title: 'Smart Auto-Fill',
      description: 'AI-powered form detection and filling. Works on any job site with 99.9% accuracy.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      stats: '10x faster applications'
    },
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: 'AI Cover Letters',
      description: 'Generate personalized, ATS-optimized cover letters that match job requirements perfectly.',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      stats: '85% higher response rate'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: 'Smart JD Analysis',
      description: 'Deep learning analysis reveals hidden requirements and optimizes your application strategy.',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      stats: '3x better job matches'
    },
    {
      icon: <BoltIcon className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Apply to 50+ jobs per hour with our advanced automation and bulk application features.',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      stats: 'Save 20+ hours/week'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer at Google',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      content: 'AutoApply Pro is a game-changer. I applied to 200+ positions in 2 weeks and landed 15 interviews. The AI cover letters are indistinguishable from human-written ones.',
      rating: 5,
      outcome: 'Landed dream job at Google'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Director at Tesla',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      content: 'The time savings are incredible. What used to take me 8 hours now takes 30 minutes. The job matching algorithm is spot-on - every application feels relevant.',
      rating: 5,
      outcome: '3x more interviews'
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist at Netflix',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      content: 'The JD analysis feature helped me understand exactly what employers wanted. I tailored my applications better and saw immediate results.',
      rating: 5,
      outcome: 'Got hired in 2 weeks'
    },
    {
      name: 'David Kim',
      role: 'Product Manager at Microsoft',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      content: 'The extension works flawlessly across all job platforms. The auto-fill accuracy is perfect, and the cover letter quality rivals professional writers.',
      rating: 5,
      outcome: 'Doubled interview rate'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for casual job seekers',
      features: [
        '10 applications per month',
        'Basic auto-fill',
        'Standard templates',
        'Email support',
        'Basic analytics'
      ],
      cta: 'Start Free',
      popular: false,
      gradient: 'from-slate-50 to-slate-100',
      savings: null
    },
    {
      name: 'Professional',
      price: '$29',
      originalPrice: '$49',
      period: 'month',
      description: 'Best for active job seekers',
      features: [
        'Unlimited applications',
        'Advanced AI auto-fill',
        'Premium AI cover letters',
        'Smart JD analysis',
        'Priority support',
        'Advanced analytics',
        'Interview tracker',
        'Salary insights'
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
      gradient: 'from-primary-50 to-primary-100',
      savings: 'Save $240/year'
    },
    {
      name: 'Enterprise',
      price: '$99',
      originalPrice: '$149',
      period: 'month',
      description: 'For teams and recruiters',
      features: [
        'Everything in Professional',
        'Team management (up to 10 users)',
        'White-label solution',
        'Custom integrations',
        'Dedicated success manager',
        'API access',
        'Advanced reporting',
        'Custom training'
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-purple-50 to-purple-100',
      savings: 'Save $600/year'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="relative container-custom">
          <div className="text-center">
            {/* Enhanced Social Proof Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-white/90 backdrop-blur-md border border-primary-200/50 text-primary-700 text-sm font-semibold mb-8 hover:bg-white hover:scale-105 hover:shadow-glow transition-all duration-500 shadow-xl group">
              <UserGroupIcon className="h-5 w-5 mr-3 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" />
              <span className="gradient-text font-bold">
                {animatedCounts.users.toLocaleString()}+ professionals
              </span>
              <span className="ml-2 text-neutral-600">landed their dream jobs with us</span>
              <div className="ml-3 flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Revolutionary Main Headline */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-neutral-900 mb-8 tracking-tight leading-[0.85]">
              <span className="block animate-fade-in-up">Land Your</span>
              <span className="block gradient-text animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Dream Job
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-neutral-700 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                10x Faster
              </span>
            </h1>

            {/* Enhanced Subheadline with Psychological Triggers */}
            <p className="text-xl md:text-2xl lg:text-3xl text-neutral-600 mb-12 max-w-5xl mx-auto leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              Join thousands of professionals who've <span className="text-primary-600 font-bold">transformed their careers</span> with AI.
              <br className="hidden md:block" />
              <span className="text-secondary-600 font-semibold">Automate applications</span>,
              <span className="text-accent-600 font-semibold"> craft perfect cover letters</span>, and
              <span className="text-primary-600 font-semibold"> land interviews faster</span> than ever before.
            </p>

            {/* Enhanced CTA Buttons with Urgency */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <Link
                to={user ? '/dashboard' : '/register'}
                className="group relative px-12 py-6 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white font-bold rounded-2xl hover:from-primary-700 hover:via-primary-800 hover:to-accent-700 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-glow min-w-[280px] text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <BoltIcon className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  {user ? 'Go to Dashboard' : 'Start Free Today'}
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-800 to-accent-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">FREE</div>
              </Link>

              <button className="group flex items-center px-12 py-6 bg-white/90 backdrop-blur-md text-neutral-700 font-bold rounded-2xl border-2 border-neutral-300 hover:bg-white hover:border-primary-300 hover:text-primary-600 hover:scale-105 hover:-translate-y-1 transition-all duration-500 min-w-[280px] text-lg shadow-xl hover:shadow-2xl">
                <PlayIcon className="h-6 w-6 mr-3 group-hover:scale-125 group-hover:text-primary-500 transition-all duration-300" />
                Watch 2-Min Demo
                <span className="ml-2 text-sm text-neutral-500 group-hover:text-primary-400">(See the magic)</span>
              </button>
            </div>

            {/* Enhanced Animated Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 hover:bg-white/95 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                  {animatedCounts.applications.toLocaleString()}+
                </div>
                <div className="text-neutral-600 font-bold text-sm mb-1">Applications Sent</div>
                <div className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-bold rounded-full">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-2 animate-pulse-soft"></div>
                  This Month
                </div>
              </div>

              <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 hover:bg-white/95 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                  {animatedCounts.timeSaved.toLocaleString()}+
                </div>
                <div className="text-neutral-600 font-bold text-sm mb-1">Hours Saved</div>
                <div className="inline-flex items-center px-3 py-1 bg-accent-100 text-accent-700 text-xs font-bold rounded-full">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  Per User
                </div>
              </div>

              <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 hover:bg-white/95 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                  {animatedCounts.successRate}%
                </div>
                <div className="text-neutral-600 font-bold text-sm mb-1">Interview Rate</div>
                <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                  <ChartBarIcon className="w-3 h-3 mr-1" />
                  Success Rate
                </div>
              </div>

              <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 hover:bg-white/95 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                  4.9
                </div>
                <div className="text-neutral-600 font-bold text-sm mb-1">User Rating</div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current hover:scale-125 transition-transform duration-200" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Revolutionary Features Section */}
      <section className="section-padding bg-gradient-to-b from-white via-surface to-surface-2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-50/30 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary-200 to-accent-200 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative container-custom">
          <div className="text-center mb-24 animate-fade-in-up">
            <div className="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-700 rounded-full font-semibold text-sm mb-6">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Trusted by 15,000+ professionals
            </div>
            <h2 className="heading-1 mb-8">
              Everything You Need to
              <span className="block gradient-text">
                Dominate Your Job Search
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge technology with proven job search strategies
              to give you an <span className="text-primary-600 font-semibold">unfair advantage</span> in today's competitive market.
            </p>
          </div>

          {/* Interactive Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group card card-hover p-10 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-primary-200 hover:bg-white transition-all duration-500 overflow-hidden"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Floating Icon */}
                <div className={`relative inline-flex p-6 rounded-3xl bg-gradient-to-br ${feature.gradient} text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl hover:shadow-2xl`}>
                  {feature.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse-soft"></div>
                  </div>
                </div>

                {/* Performance Badge */}
                <div className="relative inline-block px-4 py-2 bg-gradient-to-r from-secondary-100 to-accent-100 rounded-full text-sm font-bold text-secondary-700 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <BoltIcon className="inline h-4 w-4 mr-1" />
                  {feature.stats}
                </div>

                <h3 className="relative heading-4 mb-6 group-hover:text-primary-700 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="relative text-muted leading-relaxed text-lg mb-8">
                  {feature.description}
                </p>

                {/* Interactive CTA */}
                <div className="relative">
                  <button className="group/btn flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-all duration-300 transform group-hover:translate-x-2">
                    <span>Learn more</span>
                    <div className="ml-2 p-1 rounded-full bg-primary-100 group-hover/btn:bg-primary-200 transition-colors duration-300">
                      <ChevronRightIcon className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </button>
                </div>

                {/* Hover Effect Indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>

          {/* Additional Features Showcase */}
          <div className="mt-24 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="group text-center p-6 hover:bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-soft">
                <div className="text-3xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-sm text-muted font-semibold">Accuracy Rate</div>
              </div>
              <div className="group text-center p-6 hover:bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-soft">
                <div className="text-3xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-sm text-muted font-semibold">Job Platforms</div>
              </div>
              <div className="group text-center p-6 hover:bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-soft">
                <div className="text-3xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-muted font-semibold">Support</div>
              </div>
              <div className="group text-center p-6 hover:bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-soft">
                <div className="text-3xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">SOC2</div>
                <div className="text-sm text-muted font-semibold">Certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Revolutionary Testimonials Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-br from-primary-300 to-accent-300 rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-bl from-secondary-300 to-primary-300 rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

        <div className="relative container-custom">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-700 rounded-full font-semibold text-sm mb-6">
              <StarIcon className="h-5 w-5 mr-2 text-yellow-500 fill-current" />
              4.9/5 from 15,000+ reviews
            </div>
            <h2 className="heading-1 mb-8">
              Success Stories That
              <span className="block bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-600 bg-clip-text text-transparent">
                Speak for Themselves
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted max-w-4xl mx-auto leading-relaxed">
              Real results from real users. Join thousands of professionals who've
              <span className="text-secondary-600 font-semibold"> transformed their careers</span> with AutoApply Pro.
            </p>
          </div>

          {/* Featured Testimonial Carousel */}
          <div className="relative max-w-5xl mx-auto mb-20">
            <div className="card p-12 md:p-16 bg-white/90 backdrop-blur-md shadow-2xl border border-white/50 relative overflow-hidden group">
              {/* Animated Background Pattern */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/30 to-accent-100/30 rounded-full transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary-100/30 to-primary-100/30 rounded-full transform -translate-x-1/3 translate-y-1/3 group-hover:scale-110 transition-transform duration-700"></div>

              <div className="relative">
                {/* Enhanced Rating Display */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-8 w-8 text-yellow-500 fill-current mx-1 hover:scale-125 transition-transform duration-200"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                    <span className="ml-3 text-yellow-700 font-bold text-lg">5.0</span>
                  </div>
                </div>

                {/* Enhanced Testimonial Content */}
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-900 text-center leading-relaxed mb-12 italic">
                  <span className="text-primary-600">"</span>
                  {testimonials[currentTestimonial].content}
                  <span className="text-primary-600">"</span>
                </blockquote>

                {/* Success Outcome Badge */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <CheckIcon className="h-6 w-6 mr-3" />
                    {testimonials[currentTestimonial].outcome}
                  </div>
                </div>

                {/* Enhanced Author Section */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="h-20 w-20 rounded-2xl object-cover shadow-xl border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-6 text-center">
                    <h4 className="text-2xl font-bold text-neutral-900 mb-1">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-muted font-medium text-lg">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation */}
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={prevTestimonial}
                  className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/50 group/nav"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-neutral-600 group-hover/nav:text-primary-600 transition-colors duration-300" />
                </button>
              </div>
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={nextTestimonial}
                  className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/50 group/nav"
                >
                  <ChevronRightIcon className="h-6 w-6 text-neutral-600 group-hover/nav:text-primary-600 transition-colors duration-300" />
                </button>
              </div>
            </div>

            {/* Enhanced Dots Indicator */}
            <div className="flex justify-center mt-10 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentTestimonial
                      ? 'w-12 h-4 bg-gradient-to-r from-primary-600 to-accent-600'
                      : 'w-4 h-4 bg-neutral-300 hover:bg-neutral-400 hover:scale-125'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div
                key={index}
                className="card p-8 bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white/95 hover:scale-105 hover:-translate-y-2 transition-all duration-500 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Mini Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Preview */}
                <p className="text-muted mb-6 italic leading-relaxed">
                  "{testimonial.content.substring(0, 120)}..."
                </p>

                {/* Success Badge */}
                <div className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-6">
                  <CheckIcon className="h-4 w-4 mr-1" />
                  {testimonial.outcome}
                </div>

                {/* Author Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-xl object-cover mr-4 border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300">{testimonial.name}</h4>
                    <p className="text-muted text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>        </div>
      </section>

      {/* Enhanced Social Proof Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-50/20 via-transparent to-transparent"></div>

        <div className="relative container-custom">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-4">
              Trusted by professionals at leading companies
            </h3>
            <p className="text-muted">Join thousands who've landed roles at these top companies</p>
          </div>

          {/* Company Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60 hover:opacity-80 transition-opacity duration-300">
            <div className="flex justify-center">
              <div className="text-4xl font-black text-neutral-400 hover:text-primary-500 transition-colors duration-300">Google</div>
            </div>
            <div className="flex justify-center">
              <div className="text-4xl font-black text-neutral-400 hover:text-primary-500 transition-colors duration-300">Microsoft</div>
            </div>
            <div className="flex justify-center">
              <div className="text-4xl font-black text-neutral-400 hover:text-primary-500 transition-colors duration-300">Tesla</div>
            </div>
            <div className="flex justify-center">
              <div className="text-4xl font-black text-neutral-400 hover:text-primary-500 transition-colors duration-300">Netflix</div>
            </div>
            <div className="flex justify-center">
              <div className="text-4xl font-black text-neutral-400 hover:text-primary-500 transition-colors duration-300">Meta</div>
            </div>
            <div className="flex justify-center">
              <div className="text-4xl font-black text-neutral-400 hover:text-primary-500 transition-colors duration-300">Apple</div>
            </div>
          </div>

          {/* Enhanced Stats Bar */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-white to-primary-50 rounded-2xl border border-primary-100 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-black gradient-text mb-2">85%</div>
              <div className="text-sm text-muted font-semibold">Higher Response Rate</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white to-secondary-50 rounded-2xl border border-secondary-100 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-black gradient-text mb-2">10x</div>
              <div className="text-sm text-muted font-semibold">Faster Applications</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white to-accent-50 rounded-2xl border border-accent-100 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-black gradient-text mb-2">2,500+</div>
              <div className="text-sm text-muted font-semibold">Hours Saved Daily</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white to-primary-50 rounded-2xl border border-primary-100 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-black gradient-text mb-2">15,000+</div>
              <div className="text-sm text-muted font-semibold">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="section-padding bg-gradient-to-b from-surface to-surface-2 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-secondary-200 to-primary-200 rounded-full opacity-10 blur-3xl"></div>

        <div className="relative container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-700 rounded-full font-semibold text-sm mb-6">
              <BoltIcon className="h-5 w-5 mr-2" />
              Limited Time Offer
            </div>
            <h2 className="heading-1 mb-8">
              Choose Your
              <span className="block bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-600 bg-clip-text text-transparent">
                Success Plan
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted max-w-4xl mx-auto leading-relaxed mb-8">
              Start free and scale up as you land more interviews. All plans include our core AI features
              with advanced options for power users.
            </p>

            {/* Enhanced Limited Time Offer Badge */}
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse-soft">
              <SparklesIcon className="h-6 w-6 mr-3" />
              Limited Time: 40% OFF All Plans!
              <div className="ml-3 px-3 py-1 bg-white/20 rounded-full text-sm">
                Ends Soon
              </div>            </div>
          </div>          {/* Revolutionary Pricing Cards */}
          <div className="pricing-grid max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative card p-10 transition-all duration-500 overflow-hidden group ${
                  plan.popular
                    ? 'border-4 border-primary-500 shadow-2xl scale-105 bg-white hover:scale-110'
                    : 'border-2 border-neutral-200 hover:border-primary-300 bg-white/80 hover:bg-white hover:scale-105'
                } hover:-translate-y-4`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Enhanced Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-xl animate-bounce-subtle">
                      <SparklesIcon className="inline h-5 w-5 mr-2" />
                      🔥 MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Enhanced Savings Badge */}
                {plan.savings && (
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold transform rotate-12 shadow-xl z-10">
                    {plan.savings}
                  </div>
                )}

                {/* Background Pattern */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-black text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">{plan.name}</h3>
                    <p className="text-muted text-lg leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Enhanced Pricing Display */}
                  <div className="text-center mb-10">
                    <div className="flex items-baseline justify-center mb-2">
                      {plan.originalPrice && (
                        <span className="text-2xl text-neutral-400 line-through mr-3 font-bold">{plan.originalPrice}</span>
                      )}
                      <span className="text-6xl md:text-7xl font-black gradient-text group-hover:scale-110 transition-transform duration-300">{plan.price}</span>
                      <span className="text-muted ml-3 text-xl font-semibold">/{plan.period}</span>
                    </div>
                    {plan.period === 'month' && plan.price !== '$0' && (
                      <div className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-bold">
                        <CheckIcon className="h-4 w-4 mr-2" />
                        14-day free trial
                      </div>
                    )}
                  </div>

                  {/* Enhanced Features List */}
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start group/feature">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover/feature:scale-110 transition-transform duration-300">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-neutral-700 font-medium leading-relaxed group-hover/feature:text-neutral-900 transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Enhanced CTA Button */}
                  <Link
                    to={user ? '/dashboard' : '/register'}
                    className={`block w-full text-center py-5 rounded-2xl font-black text-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 text-white hover:from-primary-700 hover:via-accent-700 hover:to-secondary-700'
                        : 'bg-gradient-to-r from-neutral-800 to-neutral-900 text-white hover:from-neutral-700 hover:to-neutral-800'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      {plan.popular && <BoltIcon className="h-5 w-5 mr-2" />}
                      {plan.cta}
                      {plan.popular && <SparklesIcon className="h-5 w-5 ml-2" />}
                    </span>
                  </Link>

                  {/* Trust Indicators */}
                  {plan.popular && (
                    <div className="text-center mt-6">
                      <div className="flex items-center justify-center text-sm text-muted">
                        <ShieldCheckIcon className="h-4 w-4 mr-2 text-secondary-600" />
                        30-day money-back guarantee
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Effect Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Money Back Guarantee */}
          <div className="text-center mt-20">
            <div className="inline-flex items-center px-10 py-6 bg-gradient-to-r from-secondary-50 to-primary-50 border-2 border-secondary-200 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <ShieldCheckIcon className="h-10 w-10 text-secondary-600 mr-4" />
              <div className="text-left">
                <div className="text-xl font-black text-secondary-800">30-Day Money-Back Guarantee</div>
                <div className="text-secondary-600 font-medium">Not satisfied? Get a full refund, no questions asked.</div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Revolutionary Final CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container-custom text-center">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Headline */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight animate-fade-in-up">
              Ready to Transform
              <span className="block text-yellow-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Your Career?</span>
            </h2>

            {/* Enhanced Subtext */}
            <p className="text-xl md:text-2xl lg:text-3xl text-primary-100 mb-16 max-w-4xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Join <span className="text-yellow-300 font-black text-3xl md:text-4xl">15,000+</span> professionals who've already
              accelerated their job search with AutoApply Pro.
              <br className="hidden md:block" />
              Your <span className="text-yellow-300 font-bold">dream job</span> is just clicks away.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Link
                to={user ? '/dashboard' : '/register'}
                className="group relative px-12 py-6 bg-white text-primary-600 font-black rounded-2xl hover:bg-yellow-50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-white/30 text-xl min-w-[300px] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <BoltIcon className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  {user ? 'Go to Dashboard' : 'Start Free Today'}
                  <SparklesIcon className="h-6 w-6 ml-3 group-hover:scale-125 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>

              <button className="group flex items-center justify-center px-12 py-6 bg-white/10 backdrop-blur-md text-white font-black rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105 hover:-translate-y-1 transition-all duration-500 text-xl min-w-[300px]">
                <PlayIcon className="h-6 w-6 mr-3 group-hover:scale-125 transition-transform duration-300" />
                Watch Success Stories
                <div className="ml-3 px-2 py-1 bg-white/20 rounded-full text-sm">2 min</div>
              </button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-white/90 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="text-center group">
                <div className="text-3xl font-black text-yellow-300 mb-2 group-hover:scale-110 transition-transform duration-300">15,000+</div>
                <div className="text-sm font-semibold">Happy Users</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black text-yellow-300 mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
                <div className="text-sm font-semibold">User Rating</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black text-yellow-300 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-sm font-semibold">Uptime</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black text-yellow-300 mb-2 group-hover:scale-110 transition-transform duration-300">30d</div>
                <div className="text-sm font-semibold">Money Back</div>
              </div>            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
