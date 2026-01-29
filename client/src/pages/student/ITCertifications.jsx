import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle, Users, Clock, Trophy, Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useCheckSubscriptionStatusQuery } from '@/features/api/subscriptionApi';
import { Badge } from '@/components/ui/badge';

const ITCertifications = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: subscriptionStatus } = useCheckSubscriptionStatusQuery('it-certifications');

  const certificationCategories = [
    { id: 'all', name: 'All Certifications', icon: Award },
    { id: 'cloud', name: 'Cloud Computing', icon: BookOpen },
    { id: 'security', name: 'Cybersecurity', icon: Trophy },
    { id: 'networking', name: 'Networking', icon: Users },
    { id: 'devops', name: 'DevOps', icon: Star }
  ];

  const certifications = [
    {
      id: 1,
      title: 'AWS Certified Solutions Architect',
      provider: 'Amazon Web Services',
      category: 'cloud',
      level: 'Associate',
      duration: '40-60 hours',
      students: '250K+',
      rating: 4.8,
      price: 'Included',
      image: '/aws-cert.webp',
      features: ['Practice exams', 'Hands-on labs', 'Study guides', 'Mock tests'],
      description: 'Master AWS architecture and prepare for the Solutions Architect Associate certification'
    },
    {
      id: 2,
      title: 'Microsoft Azure Administrator',
      provider: 'Microsoft',
      category: 'cloud',
      level: 'Associate',
      duration: '35-50 hours',
      students: '180K+',
      rating: 4.7,
      price: 'Included',
      image: '/azure-cert.webp',
      features: ['Video tutorials', 'Practice tests', 'Lab environments', 'Exam dumps'],
      description: 'Become proficient in Azure administration and cloud services management'
    },
    {
      id: 3,
      title: 'Google Cloud Professional Architect',
      provider: 'Google Cloud',
      category: 'cloud',
      level: 'Professional',
      duration: '50-70 hours',
      students: '120K+',
      rating: 4.9,
      price: 'Included',
      image: '/gcp-cert.webp',
      features: ['Case studies', 'Architecture patterns', 'Practice exams', 'Real projects'],
      description: 'Design, develop, and manage robust solutions on Google Cloud Platform'
    },
    {
      id: 4,
      title: 'CompTIA Security+',
      provider: 'CompTIA',
      category: 'security',
      level: 'Entry',
      duration: '30-40 hours',
      students: '300K+',
      rating: 4.6,
      price: 'Included',
      image: '/security-cert.webp',
      features: ['Security fundamentals', 'Threat management', 'Practice tests', 'Study materials'],
      description: 'Build foundational cybersecurity skills and prepare for Security+ certification'
    },
    {
      id: 5,
      title: 'CCNA - Cisco Certified Network Associate',
      provider: 'Cisco',
      category: 'networking',
      level: 'Associate',
      duration: '60-80 hours',
      students: '400K+',
      rating: 4.8,
      price: 'Included',
      image: '/ccna-cert.webp',
      features: ['Network fundamentals', 'Routing & switching', 'Packet tracer labs', 'Practice exams'],
      description: 'Master networking concepts and prepare for CCNA certification exam'
    },
    {
      id: 6,
      title: 'Certified Kubernetes Administrator (CKA)',
      provider: 'Cloud Native Computing Foundation',
      category: 'devops',
      level: 'Professional',
      duration: '40-55 hours',
      students: '90K+',
      rating: 4.9,
      price: 'Included',
      image: '/k8s-cert.webp',
      features: ['Hands-on labs', 'Cluster management', 'Practice scenarios', 'Exam simulator'],
      description: 'Become a certified Kubernetes administrator with practical expertise'
    },
    {
      id: 7,
      title: 'AWS Certified Developer',
      provider: 'Amazon Web Services',
      category: 'cloud',
      level: 'Associate',
      duration: '35-50 hours',
      students: '150K+',
      rating: 4.7,
      price: 'Included',
      image: '/aws-dev-cert.webp',
      features: ['Serverless development', 'API Gateway', 'Lambda functions', 'Practice tests'],
      description: 'Learn AWS development best practices and earn your Developer certification'
    },
    {
      id: 8,
      title: 'Certified Ethical Hacker (CEH)',
      provider: 'EC-Council',
      category: 'security',
      level: 'Professional',
      duration: '70-90 hours',
      students: '200K+',
      rating: 4.8,
      price: 'Included',
      image: '/ceh-cert.webp',
      features: ['Penetration testing', 'Vulnerability assessment', 'Security tools', 'Practice labs'],
      description: 'Master ethical hacking techniques and prepare for CEH certification'
    },
    {
      id: 9,
      title: 'Docker Certified Associate',
      provider: 'Docker',
      category: 'devops',
      level: 'Associate',
      duration: '25-35 hours',
      students: '110K+',
      rating: 4.7,
      price: 'Included',
      image: '/docker-cert.webp',
      features: ['Container orchestration', 'Docker compose', 'Practice projects', 'Exam prep'],
      description: 'Learn containerization and become a Docker Certified Associate'
    }
  ];

  const filteredCertifications = certifications.filter(cert => {
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (certification) => {
    navigate(`/course/search?query=${encodeURIComponent(certification.title)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IT Certifications Hub
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto mb-6">
            Advance your career with industry-recognized IT certifications. Get comprehensive courses, practice exams, and hands-on labs.
          </p>
          {subscriptionStatus?.hasActiveSubscription && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full shadow-md">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Premium Access Active - All Certifications Included</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certifications..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {certificationCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <Award className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">15+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Certification Paths</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">2M+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Students Enrolled</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">95%</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pass Rate</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <Clock className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">500+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Practice Tests</p>
            </CardContent>
          </Card>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCertifications.map((cert) => (
            <Card
              key={cert.id}
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden bg-white dark:bg-gray-800"
            >
              <CardContent className="p-0">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative overflow-hidden">
                  <Award className="w-20 h-20 text-white/30" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      {cert.level}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {cert.provider}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      {cert.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {cert.duration}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      {cert.students}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      {cert.rating}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {cert.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {cert.price}
                      </span>
                      {subscriptionStatus?.hasActiveSubscription && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => handleEnroll(cert)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCertifications.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No certifications found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Choose Our IT Certification Courses?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Comprehensive Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Expert-created courses covering all exam objectives with detailed explanations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Practice Tests
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hundreds of practice questions and mock exams to build confidence
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Hands-on Labs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Real-world scenarios and practical exercises for hands-on experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITCertifications;
