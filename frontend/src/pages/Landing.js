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
      title: "Smart Auto-Fill",
      description: "AI-powered form detection and filling. Works on any job site with 99.9% accuracy.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      stats: "10x faster applications"
    },
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: "AI Cover Letters",
      description: "Generate personalized, ATS-optimized cover letters that match job requirements perfectly.",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      stats: "85% higher response rate"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Smart JD Analysis",
      description: "Deep learning analysis reveals hidden requirements and optimizes your application strategy.",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      stats: "3x better job matches"
    },
    {
      icon: <BoltIcon className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Apply to 50+ jobs per hour with our advanced automation and bulk application features.",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      stats: "Save 20+ hours/week"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer at Google",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "AutoApply Pro is a game-changer. I applied to 200+ positions in 2 weeks and landed 15 interviews. The AI cover letters are indistinguishable from human-written ones.",
      rating: 5,
      outcome: "Landed dream job at Google"
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Director at Tesla",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "The time savings are incredible. What used to take me 8 hours now takes 30 minutes. The job matching algorithm is spot-on - every application feels relevant.",
      rating: 5,
      outcome: "3x more interviews"
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist at Netflix",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "The JD analysis feature helped me understand exactly what employers wanted. I tailored my applications better and saw immediate results.",
      rating: 5,
      outcome: "Got hired in 2 weeks"
    },
    {
      name: "David Kim",
      role: "Product Manager at Microsoft",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content: "The extension works flawlessly across all job platforms. The auto-fill accuracy is perfect, and the cover letter quality rivals professional writers.",
      rating: 5,
      outcome: "Doubled interview rate"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for casual job seekers",
      features: [
        "10 applications per month",
        "Basic auto-fill",
        "Standard templates",
        "Email support",
        "Basic analytics"
      ],
      cta: "Start Free",
      popular: false,
      gradient: "from-slate-50 to-slate-100",
      savings: null
    },
    {
      name: "Professional",
      price: "$29",
      originalPrice: "$49",
      period: "month",
      description: "Best for active job seekers",
      features: [
        "Unlimited applications",
        "Advanced AI auto-fill",
        "Premium AI cover letters",
        "Smart JD analysis",
        "Priority support",
        "Advanced analytics",
        "Interview tracker",
        "Salary insights"
      ],
      cta: "Start 14-Day Free Trial",
      popular: true,
      gradient: "from-primary-50 to-primary-100",
      savings: "Save $240/year"
    },
    {
      name: "Enterprise",
      price: "$99",
      originalPrice: "$149",
      period: "month",
      description: "For teams and recruiters",
      features: [
        "Everything in Professional",
        "Team management (up to 10 users)",
        "White-label solution",
        "Custom integrations",
        "Dedicated success manager",
        "API access",
        "Advanced reporting",
        "Custom training"
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-purple-50 to-purple-100",
      savings: "Save $600/year"
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
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200/50 text-primary-700 text-sm font-semibold mb-8 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {animatedCounts.users.toLocaleString()}+ job seekers
              </span>
              <span className="ml-2">landed their dream jobs</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tight leading-[0.9]">
              Land Your
              <span className="block bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                Dream Job
              </span>
              <span className="block text-5xl md:text-6xl font-bold text-gray-700">
                10x Faster
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              The world's most advanced AI-powered job application platform. 
              <span className="text-primary-600 font-semibold"> Automate applications</span>,
              <span className="text-purple-600 font-semibold"> generate perfect cover letters</span>, and
              <span className="text-cyan-600 font-semibold"> analyze job matches</span> with superhuman precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="group relative px-10 py-5 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-600 text-white font-bold rounded-2xl hover:from-primary-700 hover:via-primary-800 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary-500/25 min-w-[240px] text-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <BoltIcon className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <button className="group flex items-center px-10 py-5 bg-white/80 backdrop-blur-sm text-gray-700 font-bold rounded-2xl border-2 border-gray-300 hover:bg-white hover:border-primary-300 hover:text-primary-600 transition-all duration-300 min-w-[240px] text-lg shadow-xl hover:shadow-2xl">
                <PlayIcon className="h-6 w-6 mr-3 group-hover:scale-110 group-hover:text-primary-500 transition-all duration-300" />
                Watch Demo (2 min)
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {animatedCounts.applications.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-semibold text-sm">Applications Sent</div>
                <div className="text-emerald-600 text-xs font-bold mt-1">This Month</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {animatedCounts.timeSaved.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-semibold text-sm">Hours Saved</div>
                <div className="text-purple-600 text-xs font-bold mt-1">Per User</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {animatedCounts.successRate}%
                </div>
                <div className="text-gray-600 font-semibold text-sm">Success Rate</div>
                <div className="text-blue-600 text-xs font-bold mt-1">Interview Rate</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  4.9
                </div>
                <div className="text-gray-600 font-semibold text-sm">User Rating</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Everything You Need to
              <span className="block bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Dominate Your Job Search
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              Our AI-powered platform combines cutting-edge technology with proven job search strategies 
              to give you an unfair advantage in today's competitive market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-10 bg-white rounded-3xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                
                {/* Stats badge */}
                <div className="relative inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700 mb-4 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors duration-300">
                  {feature.stats}
                </div>
                
                <h3 className="relative text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="relative text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div className="relative mt-6">
                  <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-300 group-hover:translate-x-2 transform flex items-center">
                    Learn more 
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-primary-50 via-purple-50 to-cyan-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-100/30 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Success Stories That
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Speak for Themselves
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-medium">
              Real results from real users. Join thousands of professionals who've transformed their careers with AutoApply Pro.
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full opacity-30 transform translate-x-32 -translate-y-32"></div>
              
              <div className="relative">
                {/* Rating stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <StarIcon key={i} className="h-8 w-8 text-yellow-400 fill-current mx-1" />
                  ))}
                </div>

                {/* Testimonial content */}
                <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 text-center leading-relaxed mb-10 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                {/* Success outcome */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full text-green-800 font-bold text-lg">
                    <CheckIcon className="h-5 w-5 mr-2" />
                    {testimonials[currentTestimonial].outcome}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-center">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="h-16 w-16 rounded-full object-cover mr-4 shadow-lg"
                  />
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-gray-600 font-medium">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={prevTestimonial}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={nextTestimonial}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                >
                  <ChevronRightIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-primary-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Additional testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content.substring(0, 120)}..."</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Choose Your
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Success Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-medium">
              Start free and scale up as you land more interviews. All plans include our core AI features 
              with advanced options for power users.
            </p>
            
            {/* Limited time offer */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold text-lg mt-8 animate-pulse">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Limited Time: 40% OFF All Plans!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-500 transform hover:-translate-y-3 ${
                  plan.popular
                    ? 'border-primary-500 shadow-2xl scale-105 bg-gradient-to-b from-primary-50 to-white'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-xl bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 text-white px-8 py-3 rounded-full text-sm font-black shadow-lg">
                      🔥 MOST POPULAR
                    </div>
                  </div>
                )}

                {plan.savings && (
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
                    {plan.savings}
                  </div>
                )}

                <div className="relative">
                  <h3 className="text-3xl font-black text-gray-900 mb-3">{plan.name}</h3>
                  <p className="text-gray-600 mb-8 text-lg">{plan.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center">
                      {plan.originalPrice && (
                        <span className="text-2xl text-gray-400 line-through mr-3">{plan.originalPrice}</span>
                      )}
                      <span className="text-6xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2 text-xl">/{plan.period}</span>
                    </div>
                    {plan.period === 'month' && plan.price !== '$0' && (
                      <p className="text-center text-green-600 font-bold mt-2">14-day free trial</p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className={`block w-full text-center py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 text-white hover:from-primary-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {plan.popular && (
                    <div className="text-center mt-4">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                        30-day money-back guarantee
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Money back guarantee */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-green-50 border-2 border-green-200 rounded-2xl">
              <ShieldCheckIcon className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-left">
                <div className="text-lg font-bold text-green-800">30-Day Money-Back Guarantee</div>
                <div className="text-green-600">Not satisfied? Get a full refund, no questions asked.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Ready to Transform
            <span className="block text-yellow-300">Your Career?</span>
          </h2>
          <p className="text-2xl text-primary-100 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
            Join <span className="text-yellow-300 font-bold">15,000+</span> professionals who've already 
            accelerated their job search with AutoApply Pro. Your dream job is just clicks away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="group relative px-12 py-6 bg-white text-primary-600 font-black rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25 text-xl min-w-[280px]"
            >
              <span className="flex items-center justify-center">
                <BoltIcon className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Start Your Free Trial
              </span>
            </Link>
            <Link
              to="/home"
              className="px-12 py-6 bg-transparent border-3 border-white text-white font-black rounded-2xl hover:bg-white hover:text-primary-600 transition-all duration-300 text-xl min-w-[280px] transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div className="text-white/90 text-sm font-semibold">✓ No Credit Card Required</div>
            <div className="text-white/90 text-sm font-semibold">✓ 14-Day Free Trial</div>
            <div className="text-white/90 text-sm font-semibold">✓ Cancel Anytime</div>
            <div className="text-white/90 text-sm font-semibold">✓ Money-Back Guarantee</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
