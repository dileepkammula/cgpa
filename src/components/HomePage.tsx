import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen, TrendingUp, Award, ArrowRight, Star, Users, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Calculator,
      title: "Smart Calculation",
      description: "Real-time CGPA calculation with instant results and validation"
    },
    {
      icon: BookOpen,
      title: "Multi-Semester Support",
      description: "Add unlimited semesters and subjects with flexible grading"
    },
    {
      icon: TrendingUp,
      title: "Grade System Toggle",
      description: "Switch between 4.0 and 10.0 grading scales seamlessly"
    },
    {
      icon: Award,
      title: "PDF Export",
      description: "Download your CGPA report as a professional PDF document"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Students Helped" },
    { icon: Star, value: "4.9", label: "User Rating" },
    { icon: Clock, value: "24/7", label: "Available" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200/30 dark:bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -top-5 -right-5 w-32 h-32 bg-purple-200/30 dark:bg-blue-500/20 rounded-full blur-xl"></div>
            
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 dark:bg-purple-900/50 rounded-full text-blue-700 dark:text-purple-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Star className="h-4 w-4 mr-2" />
              Trusted by thousands of students
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Calculate Your
              <br />
              <span className="relative">
                CGPA
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The most intuitive and comprehensive CGPA calculator designed specifically for students. 
              Track your academic progress with precision and style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/calculator"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center space-x-2"
              >
                <Calculator className="h-5 w-5" />
                <span>Start Calculating</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 border-2 border-blue-200 dark:border-purple-400 text-blue-700 dark:text-purple-300 rounded-xl font-semibold text-lg hover:bg-blue-50 dark:hover:bg-purple-900/30 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make CGPA calculation effortless and accurate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-purple-500/20 hover:border-blue-300 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Calculate Your CGPA?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who trust our calculator for accurate academic tracking
              </p>
              <Link
                to="/calculator"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <Calculator className="h-5 w-5" />
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;