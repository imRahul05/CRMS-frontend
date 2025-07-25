import { Button } from "../components/ui/button";
import { motion, useScroll, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";

const LandingPage = () => {
  const featuresRef = useRef(null);
  const techStackRef = useRef(null);
  const ctaRef = useRef(null);
  
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const techStackInView = useInView(techStackRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Streamline Your <span className="text-blue-500">Referral</span> Process
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Efficiently manage employee referrals, track candidates, and make better hiring decisions with our comprehensive referral management system.
            </p>
            <div className="space-x-4">
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg transition-all">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-6 text-lg hover:bg-white hover:text-black transition-all">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <img 
              src="/src/assets/admin_dashboard.png" 
              alt="Dashboard Preview" 
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Features Section */}
        <section ref={featuresRef} className="mt-24">
          <motion.div
            style={{
              transform: featuresInView ? "none" : "translateY(50px)",
              opacity: featuresInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
            }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Comprehensive Feature Set
            </h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              Everything you need to manage your referral program effectively, from submission to hiring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all"
                >
                  <div className="text-blue-500 text-2xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      {/* Tech Stack Section */}
      <section ref={techStackRef} className="container mx-auto px-6 py-16 mt-24 border-t border-gray-800">
        <motion.div
          style={{
            transform: techStackInView ? "none" : "translateY(50px)",
            opacity: techStackInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Built with Modern Technology
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Powered by industry-leading technologies to ensure reliability and performance
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              <span>React</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span>Vite</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <span>Context API</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📡</span>
              <span>Axios</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="container mx-auto px-6 py-16">
        <motion.div
          style={{
            transform: ctaInView ? "none" : "translateY(50px)",
            opacity: ctaInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}
        >
          <div className="bg-gray-800 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Referral Process?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join companies that trust CRMS to streamline their referral management process.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg transition-all">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-8 py-4 text-lg hover:bg-white hover:text-black transition-all">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="container mx-auto px-6 py-8 mt-8">
        <div className="text-center text-gray-400">
          <p>&copy; 2025 CRMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: "�",
    title: "Secure Authentication",
    description: "Enterprise-grade security with JWT-based authentication and role-based access control for users and admins."
  },
  {
    icon: "�📊",
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

export default LandingPage;
