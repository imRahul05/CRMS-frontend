import { Button } from "../components/ui/button";
import { motion, useScroll, useInView, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import adminDashboard from '@/assets/admin_dashboard.png';
const LandingPage = () => {
  const featuresRef = useRef(null);
  const techStackRef = useRef(null);
  const ctaRef = useRef(null);
  const heroRef = useRef(null);
  
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const techStackInView = useInView(techStackRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm"
            >
              <span className="text-blue-400 text-sm font-medium">🚀 Transform Your Hiring Process</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 leading-tight">
              Streamline Your{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Referral
              </motion.span>{" "}
              Process
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed max-w-xl"
            >
              Efficiently manage employee referrals, track candidates, and make better hiring decisions with our comprehensive referral management system powered by cutting-edge technology.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 group-hover:shadow-blue-500/25">
                    Get Started
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="px-10 py-6 text-lg font-semibold rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 hover:border-white"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:block perspective-1000"
          >
            <motion.div
              style={{ y }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
              <motion.img 
                src={adminDashboard} 
                alt="Dashboard Preview" 
                className="relative rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section ref={featuresRef} className="mt-32">
          <motion.div
            style={{
              transform: featuresInView ? "none" : "translateY(100px)",
              opacity: featuresInView ? 1 : 0,
              transition: "all 1.2s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s"
            }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm mb-8"
            >
              <span className="text-purple-400 text-sm font-medium">✨ Comprehensive Features</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From submission to hiring, our platform provides all the tools you need to manage your referral program effectively and efficiently.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all duration-300 group-hover:bg-slate-800/70">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Tech Stack Section */}
      <section ref={techStackRef} className="container mx-auto px-6 py-20 mt-32 border-t border-white/10 relative z-10">
        <motion.div
          style={{
            transform: techStackInView ? "none" : "translateY(80px)",
            opacity: techStackInView ? 1 : 0,
            transition: "all 1.2s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s"   }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm mb-8"
          >
            <span className="text-cyan-400 text-sm font-medium">⚡ Powered by Modern Tech</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-6">
            Built with Industry Leaders
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            Engineered with cutting-edge technologies to ensure maximum reliability, performance, and scalability for your growing business needs.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={techStackInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 10,
                }}
                className="group flex flex-col items-center gap-4 p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 hover:bg-slate-800/50"
              >
                <div className="text-4xl group-hover:scale-125 transition-transform duration-300">
                  {tech.icon}
                </div>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          style={{
            transform: ctaInView ? "none" : "translateY(80px)",
            opacity: ctaInView ? 1 : 0,
            transition: "all 1.2s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s"
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 md:p-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-6"
              >
                Ready to Transform Your Referral Process?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Join forward-thinking companies that trust CRMS to revolutionize their referral management process and accelerate their hiring success.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-6"
              >
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:shadow-blue-500/25">
                      Get Started Now
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="px-12 py-6 text-lg font-semibold rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 hover:border-white">
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="container mx-auto px-6 py-12 mt-16 border-t border-white/10 relative z-10">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-gray-500 text-lg"
          >
            &copy; 2025 CRMS. Crafted with ❤️ for better hiring.
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: "🔐",
    title: "Secure Authentication",
    description: "Enterprise-grade security with JWT-based authentication and role-based access control for users and admins."
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Get detailed insights into your referral pipeline with interactive visualizations and comprehensive statistics."
  },
  {
    icon: "👥",
    title: "Easy Referrals",
    description: "Simple and intuitive interface for employees to submit referrals with resume attachments and track their progress."
  },
  {
    icon: "🔄",
    title: "Real-time Status Tracking",
    description: "Stay updated with real-time notifications on candidate status changes and hiring progress."
  },
  {
    icon: "⚡",
    title: "Admin Controls",
    description: "Powerful admin dashboard to manage referrals, update candidate status, and oversee the entire hiring pipeline."
  },
  {
    icon: "📱",
    title: "Responsive Design",
    description: "Access the platform seamlessly across all devices with our modern, responsive interface built with Tailwind CSS."
  }
];

const techStack = [
  { icon: "⚛️", name: "React" },
  { icon: "🎨", name: "Tailwind CSS" },
  { icon: "🚀", name: "Vite" },
  { icon: "🔄", name: "Context API" },
  { icon: "📡", name: "Axios" }
];

export default LandingPage;