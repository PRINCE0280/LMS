import React, { useState } from 'react';
import { BarChart3, Brain, Database, LineChart, TrendingUp, BookOpen, CheckCircle, Users, Clock, Star, Search, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useCheckSubscriptionStatusQuery } from '@/features/api/subscriptionApi';
import { Badge } from '@/components/ui/badge';

const DataScience = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: subscriptionStatus } = useCheckSubscriptionStatusQuery('data-science');

  const courseCategories = [
    { id: 'all', name: 'All Courses', icon: Database },
    { id: 'ml', name: 'Machine Learning', icon: Brain },
    { id: 'analytics', name: 'Data Analytics', icon: BarChart3 },
    { id: 'visualization', name: 'Data Visualization', icon: LineChart },
    { id: 'bigdata', name: 'Big Data', icon: TrendingUp }
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete Python for Data Science',
      category: 'analytics',
      level: 'Beginner',
      duration: '45 hours',
      students: '500K+',
      rating: 4.8,
      price: 'Included',
      image: '/python-ds.webp',
      instructor: 'Dr. Sarah Johnson',
      features: ['NumPy & Pandas', 'Data cleaning', 'Statistical analysis', 'Real projects'],
      description: 'Master Python programming for data science with hands-on projects and real-world datasets'
    },
    {
      id: 2,
      title: 'Machine Learning A-Z',
      category: 'ml',
      level: 'Intermediate',
      duration: '60 hours',
      students: '800K+',
      rating: 4.9,
      price: 'Included',
      image: '/ml-course.webp',
      instructor: 'Prof. Michael Chen',
      features: ['Supervised learning', 'Neural networks', 'Deep learning', 'Model deployment'],
      description: 'Comprehensive machine learning course covering algorithms, neural networks, and deployment'
    },
    {
      id: 3,
      title: 'Data Visualization with Tableau',
      category: 'visualization',
      level: 'Beginner',
      duration: '30 hours',
      students: '300K+',
      rating: 4.7,
      price: 'Included',
      image: '/tableau.webp',
      instructor: 'Emma Davis',
      features: ['Interactive dashboards', 'Visual analytics', 'Business intelligence', 'Best practices'],
      description: 'Create stunning data visualizations and interactive dashboards with Tableau'
    },
    {
      id: 4,
      title: 'Advanced SQL for Data Analysis',
      category: 'analytics',
      level: 'Intermediate',
      duration: '35 hours',
      students: '450K+',
      rating: 4.8,
      price: 'Included',
      image: '/sql-advanced.webp',
      instructor: 'James Wilson',
      features: ['Complex queries', 'Window functions', 'Query optimization', 'Database design'],
      description: 'Master advanced SQL techniques for complex data analysis and optimization'
    },
    {
      id: 5,
      title: 'Deep Learning with TensorFlow',
      category: 'ml',
      level: 'Advanced',
      duration: '70 hours',
      students: '600K+',
      rating: 4.9,
      price: 'Included',
      image: '/tensorflow.webp',
      instructor: 'Dr. Lisa Anderson',
      features: ['CNNs & RNNs', 'Transfer learning', 'Model optimization', 'Production deployment'],
      description: 'Build and deploy deep learning models with TensorFlow and Keras'
    },
    {
      id: 6,
      title: 'Big Data with Apache Spark',
      category: 'bigdata',
      level: 'Advanced',
      duration: '55 hours',
      students: '250K+',
      rating: 4.7,
      price: 'Included',
      image: '/spark.webp',
      instructor: 'Robert Martinez',
      features: ['Spark Core', 'Spark SQL', 'MLlib', 'Streaming data'],
      description: 'Process and analyze big data at scale using Apache Spark ecosystem'
    },
    {
      id: 7,
      title: 'R Programming for Statistics',
      category: 'analytics',
      level: 'Beginner',
      duration: '40 hours',
      students: '350K+',
      rating: 4.6,
      price: 'Included',
      image: '/r-programming.webp',
      instructor: 'Dr. Patricia Lee',
      features: ['R fundamentals', 'Statistical modeling', 'ggplot2', 'Data manipulation'],
      description: 'Learn R programming for statistical analysis and data visualization'
    },
    {
      id: 8,
      title: 'Natural Language Processing',
      category: 'ml',
      level: 'Advanced',
      duration: '50 hours',
      students: '400K+',
      rating: 4.8,
      price: 'Included',
      image: '/nlp.webp',
      instructor: 'Dr. Kevin Brown',
      features: ['Text preprocessing', 'Sentiment analysis', 'Transformers', 'BERT & GPT'],
      description: 'Master NLP techniques and build AI applications that understand human language'
    },
    {
      id: 9,
      title: 'Power BI for Business Analytics',
      category: 'visualization',
      level: 'Beginner',
      duration: '35 hours',
      students: '550K+',
      rating: 4.7,
      price: 'Included',
      image: '/powerbi.webp',
      instructor: 'Amanda Clark',
      features: ['DAX formulas', 'Power Query', 'Custom visuals', 'Report building'],
      description: 'Create powerful business intelligence reports and dashboards with Power BI'
    },
    {
      id: 10,
      title: 'Time Series Analysis & Forecasting',
      category: 'analytics',
      level: 'Intermediate',
      duration: '45 hours',
      students: '280K+',
      rating: 4.8,
      price: 'Included',
      image: '/timeseries.webp',
      instructor: 'Dr. Thomas White',
      features: ['ARIMA models', 'Seasonal patterns', 'Prophet', 'Forecast evaluation'],
      description: 'Master time series analysis and build accurate forecasting models'
    },
    {
      id: 11,
      title: 'Computer Vision with OpenCV',
      category: 'ml',
      level: 'Advanced',
      duration: '55 hours',
      students: '320K+',
      rating: 4.9,
      price: 'Included',
      image: '/opencv.webp',
      instructor: 'Dr. Jennifer Garcia',
      features: ['Image processing', 'Object detection', 'Face recognition', 'Video analysis'],
      description: 'Build computer vision applications using OpenCV and deep learning'
    },
    {
      id: 12,
      title: 'Hadoop Ecosystem Masterclass',
      category: 'bigdata',
      level: 'Intermediate',
      duration: '48 hours',
      students: '200K+',
      rating: 4.6,
      price: 'Included',
      image: '/hadoop.webp',
      instructor: 'Mark Thompson',
      features: ['HDFS', 'MapReduce', 'Hive', 'HBase'],
      description: 'Master the Hadoop ecosystem for distributed data processing and storage'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (course) => {
    navigate(`/course/search?query=${encodeURIComponent(course.title)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Data Science Academy
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto mb-6">
            Transform your career with comprehensive data science courses. Master Python, ML, AI, and analytics with industry experts.
          </p>
          {subscriptionStatus?.hasActiveSubscription && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full shadow-md">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Premium Access Active - All Courses Included</span>
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
              placeholder="Search courses by title or instructor..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {courseCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
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
              <BookOpen className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">100+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Expert-Led Courses</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">5M+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active Students</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <Brain className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">200+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Real Projects</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">92%</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Career Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden bg-white dark:bg-gray-800"
            >
              <CardContent className="p-0">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center relative overflow-hidden">
                  <Code className="w-20 h-20 text-white/30" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      {course.level}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      by {course.instructor}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      {course.rating}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {course.price}
                      </span>
                      {subscriptionStatus?.hasActiveSubscription && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => handleEnroll(course)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
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
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Learning Path Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Your Data Science Learning Path
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Foundations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Python, SQL, and statistics basics
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Data Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pandas, data cleaning, and EDA
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Machine Learning
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ML algorithms and model building
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Specialization
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Deep learning, NLP, or Big Data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataScience;
