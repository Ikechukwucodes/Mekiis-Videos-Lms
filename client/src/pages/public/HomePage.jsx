import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService.js';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Shield,
  Clock,
  Compass,
  Award,
  Video,
  Database,
  Users,
  CheckCircle2,
  Play,
  Layers,
  Flame,
  Star
} from 'lucide-react';

export const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService
      .getCourses()
      .then((courses) => setFeaturedCourses(courses.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Ambient Linear Gradient Orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] opacity-80 dark:opacity-40 blur-[100px] glow-gradient-light dark:glow-gradient-dark -z-10" />
      <div className="pointer-events-none absolute top-[700px] -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#6dd5ed]/30 to-[#2193b0]/20 dark:from-[#1f4037]/50 dark:to-[#99f2c8]/15 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none absolute top-[1500px] -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#2193b0]/30 to-[#6dd5ed]/20 dark:from-[#09151c]/60 dark:to-[#1f4037]/40 rounded-full blur-[120px] -z-10" />

      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 bg-grid-mesh border-b border-white/40 dark:border-teal-950/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Digital Sky & Midnight Calm Animated Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 dark:bg-[#0d2024]/85 backdrop-blur-md border border-[#2193b0]/40 dark:border-[#99f2c8]/40 text-[#17697f] dark:text-[#99f2c8] text-xs font-bold tracking-wide uppercase mb-8 shadow-sm shadow-[#2193b0]/15 hover:shadow-[#2193b0]/30 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6dd5ed] dark:bg-[#99f2c8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2193b0] dark:bg-[#99f2c8]"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#2193b0] dark:text-[#99f2c8]" />
            <span>Welcome to Mekiis Videos LMS</span>
          </div>

          {/* Master Headline with Dual-Mode Linear Gradient Text */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12]">
            <span className="text-slate-900 dark:text-white">Master In-Demand Skills with </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#17697f] via-[#2193b0] to-[#0284c7] dark:from-[#99f2c8] dark:via-[#5eead4] dark:to-[#38bdf8]">
              Interactive Video Curricula
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-7 text-lg sm:text-xl text-slate-800 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Elevate your career through structured multi-module courses, persistent database-backed lesson tracking, and crystal-clear video streaming.
          </p>

          {/* Action Buttons with Ocean Breeze and Midnight Calm Gradients */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Link to="/courses" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] hover:from-[#1b809a] hover:to-[#55c7e1] shadow-xl shadow-[#2193b0]/35 hover:shadow-[#2193b0]/55 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Explore Courses <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-[#0a161c]/90 backdrop-blur-md border border-white/70 dark:border-teal-900/60 hover:border-[#2193b0]/60 dark:hover:border-[#99f2c8]/60 hover:bg-white dark:hover:bg-[#0e2129] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                Sign In to Learn
              </button>
            </Link>
          </div>

          {/* Value Props Grid with Glassmorphism and Linear Gradients */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto text-left">
            {[
              {
                title: 'Persistent Progress',
                desc: 'Real-time database sync saves your completed lessons and resume points forever.',
                icon: CheckCircle,
                badge: 'Zero Data Loss'
              },
              {
                title: 'Multi-Source Video',
                desc: 'Seamless streaming from YouTube, Vimeo, HTML5 MP4, and secured video embeds.',
                icon: PlayCircle,
                badge: '4K Ready'
              },
              {
                title: 'Dual-Role Architecture',
                desc: 'Full role-based security separating student learning and admin course studio.',
                icon: Shield,
                badge: 'RBAC Security'
              },
              {
                title: 'Self-Paced Mastery',
                desc: 'Learn on any device, anywhere, with instant certificate generation on completion.',
                icon: Clock,
                badge: 'Lifetime Access'
              }
            ].map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-5 rounded-2xl transition-all duration-300 bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md border border-white/60 dark:border-teal-900/40 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-teal-500/15 hover:border-[#2193b0]/60 dark:hover:border-[#99f2c8]/50 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle Top Gradient Accent Strip */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2193b0] via-[#4facfe] to-[#6dd5ed] dark:from-[#1f4037] dark:via-[#2e7462] dark:to-[#99f2c8] opacity-70 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2193b0] to-[#6dd5ed] dark:from-[#1f4037] dark:to-[#2e7462] text-white dark:text-[#99f2c8] flex items-center justify-center shadow-md shadow-cyan-500/25 dark:shadow-teal-900/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-teal-950/70 text-[#17697f] dark:text-[#99f2c8] border border-cyan-200/60 dark:border-teal-800/60">
                      {prop.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#17697f] dark:group-hover:text-[#99f2c8] transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {prop.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VELOCITY & METRICS RIBBON                                                */}
      {/* ========================================================================= */}
      <section className="relative py-10 bg-white/80 dark:bg-[#071318]/80 border-b border-white/50 dark:border-teal-950/60 transition-colors backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '15,000+', label: 'Active Students', icon: Users },
              { value: '99.4%', label: 'Completion Rate', icon: CheckCircle2 },
              { value: '100%', label: 'Persistent Cloud Sync', icon: Database },
              { value: '4.9 / 5', label: 'Average Course Rating', icon: Star }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#17697f] via-[#2193b0] to-[#0284c7] dark:from-[#99f2c8] dark:via-[#5eead4] dark:to-[#38bdf8] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                  <stat.icon className="w-3.5 h-3.5 text-[#2193b0] dark:text-[#99f2c8]" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED COURSES SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/70 dark:bg-teal-950/70 border border-cyan-300/60 dark:border-teal-700/60 text-[#17697f] dark:text-[#99f2c8] text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" /> Curated Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Learning Paths
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
              Hand-crafted curriculum authored by industry veterans with step-by-step video lessons and progress milestones.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline" size="sm" icon={Compass}>
              View Full Catalog
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/90 dark:bg-[#09151a]/90 rounded-3xl border border-white/60 dark:border-teal-900/40 h-96 animate-pulse p-4"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div
                key={course._id}
                className="group relative rounded-3xl transition-all duration-300 bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md border border-white/60 dark:border-teal-900/40 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/15 dark:hover:shadow-teal-900/30 hover:border-[#2193b0]/60 dark:hover:border-[#99f2c8]/60 hover:-translate-y-1.5 flex flex-col overflow-hidden"
              >
                {/* Thumbnail with Gradient Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* Subtle darkening gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Play Button Icon on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/95 dark:bg-[#0d2024]/95 backdrop-blur-md text-[#2193b0] dark:text-[#99f2c8] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Level Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#17697f] dark:text-[#99f2c8]">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1 group-hover:text-[#2193b0] dark:group-hover:text-[#99f2c8] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-teal-950/80 flex items-center justify-between">
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#2193b0] dark:text-[#99f2c8]" />
                      {course.lessonCount || 0} Lessons • {course.moduleCount || 0} Modules
                    </div>
                    <Link to={`/courses/${course.slug || course._id}`}>
                      <span className="text-xs font-bold text-[#17697f] dark:text-[#99f2c8] group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        Start Learning →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE LEARNING PREVIEW (THEATER SHOWCASE)                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-[#2193b0] via-[#4facfe] to-[#6dd5ed] dark:from-[#1f4037] dark:via-[#2e7462] dark:to-[#99f2c8] shadow-2xl shadow-cyan-900/25 dark:shadow-teal-950/40">
          <div className="bg-[#071318] rounded-[22px] overflow-hidden text-white">
            
            {/* Top Browser Bar */}
            <div className="h-10 bg-[#050e12] px-4 flex items-center justify-between border-b border-teal-950/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-[11px] font-mono text-teal-300/80 bg-[#09181f] px-4 py-0.5 rounded-md border border-teal-900/50">
                learnpulse.mekiisvideos.com/learn/fullstack-javascript
              </div>
              <div className="text-xs text-teal-400/70 font-semibold">HD Theater View</div>
            </div>

            {/* Split Theater Layout Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
              
              {/* Left Mock Video Screen */}
              <div className="lg:col-span-8 bg-black relative flex flex-col justify-between p-6 sm:p-8">
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[#6dd5ed] text-xs font-bold uppercase tracking-wider">
                    Lesson 3 • Variables & Data Structures
                  </span>
                  <span className="text-xs text-slate-400 font-mono">1080p 60fps</span>
                </div>

                <div className="my-auto py-12 text-center z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2193b0] to-[#6dd5ed] dark:from-[#1f4037] dark:to-[#99f2c8] flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 fill-white ml-1 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mt-4">Understanding Primitive vs. Reference Types</h4>
                  <p className="text-xs text-slate-400 mt-1">Runtime: 12 minutes • Interactive Code Sandbox Included</p>
                </div>

                {/* Mock Player Progress Bar */}
                <div className="space-y-2 z-10">
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#2193b0] via-[#6dd5ed] to-[#99f2c8] w-3/4 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>09:12 / 12:45</span>
                    <span className="text-[#99f2c8] font-bold">Auto-Saving Progress to Cloud...</span>
                  </div>
                </div>
              </div>

              {/* Right Mock Curriculum Sidebar */}
              <div className="lg:col-span-4 bg-[#071318] border-t lg:border-t-0 lg:border-l border-teal-950/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-teal-950/60">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Curriculum Progress</h5>
                    <span className="text-xs font-extrabold text-[#99f2c8]">75% Complete</span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {[
                      { title: '1. Welcome & Environment Setup', done: true },
                      { title: '2. Syntax and Core Keywords', done: true },
                      { title: '3. Variables & Data Structures', done: false, active: true },
                      { title: '4. Functions and Scope Closures', done: false },
                      { title: '5. Asynchronous Promises & Async/Await', done: false }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition ${
                          item.active
                            ? 'bg-[#2193b0]/20 border border-[#2193b0]/50 text-[#6dd5ed] dark:text-[#99f2c8] font-bold'
                            : item.done
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4 text-[#99f2c8] shrink-0" />
                        ) : item.active ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#6dd5ed] dark:border-[#99f2c8] flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6dd5ed] dark:bg-[#99f2c8]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-teal-950/60">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] dark:from-[#1f4037] dark:to-[#2e7462] hover:dark:to-[#388572] shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition cursor-pointer"
                  >
                    ✓ Mark Lesson Complete & Continue
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHY MEKIIS VIDEOS LMS - THREE PILLARS                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/70 dark:bg-teal-950/70 border border-cyan-300/60 dark:border-teal-700/60 text-[#17697f] dark:text-[#99f2c8] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Architected for Speed
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Serious Online Learning
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Every layer of Mekiis Videos LMS is optimized for student engagement, robust reliability, and complete administrative control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Multi-Source Video Engine',
              desc: 'Seamlessly embeds YouTube, Vimeo, HTML5 MP4, and direct stream links with XSS protection and distraction-free theater view.',
              icon: Video,
              gradient: 'from-[#2193b0] to-[#6dd5ed] dark:from-[#17697f] dark:to-[#6dd5ed]'
            },
            {
              title: 'Persistent Database Engine',
              desc: 'Every lesson completed, current position, and course milestone is immediately written to MongoDB. Resume seamlessly anytime.',
              icon: Database,
              gradient: 'from-[#17697f] to-[#2193b0] dark:from-[#1f4037] dark:to-[#2e7462]'
            },
            {
              title: 'Verified Digital Certificates',
              desc: 'Upon completing 100% of any published course, students receive an official verifiable certificate with custom seal and dates.',
              icon: Award,
              gradient: 'from-[#0284c7] to-[#38bdf8] dark:from-[#1a3832] dark:to-[#99f2c8]'
            }
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="relative rounded-3xl p-8 bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md border border-white/60 dark:border-teal-900/40 shadow-sm hover:shadow-xl hover:border-[#2193b0]/50 dark:hover:border-[#99f2c8]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pillar.gradient} text-white flex items-center justify-center mb-6 shadow-lg shadow-cyan-900/15 dark:shadow-teal-950/30`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CALL TO ACTION (CTA) BANNER WITH LINEAR GRADIENT                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-28">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 text-center text-white bg-gradient-to-r from-[#2193b0] via-[#17697f] to-[#0d5568] dark:from-[#09151a] dark:via-[#1f4037] dark:to-[#0f2a24] border border-white/30 dark:border-[#99f2c8]/30 shadow-2xl shadow-cyan-900/25 dark:shadow-teal-950/40">
          
          {/* Subtle Grid Accent in CTA */}
          <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 dark:bg-[#1f4037]/50 backdrop-blur-md text-white dark:text-[#99f2c8] text-xs font-bold uppercase tracking-wider border border-white/30 dark:border-[#99f2c8]/30">
              <Sparkles className="w-3.5 h-3.5" /> Start Learning in Seconds
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Skillset Today?
            </h2>

            <p className="text-base sm:text-lg text-white/90 dark:text-slate-200 max-w-xl mx-auto leading-relaxed">
              Create an account in less than one minute, enroll in curated courses, and start tracking your real-world progress.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-[#17697f] hover:bg-cyan-50 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Create Free Student Account
                </button>
              </Link>
              <Link to="/courses" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 hover:border-white/50 transition-all duration-200 cursor-pointer"
                >
                  Browse Course Catalog
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
