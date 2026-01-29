import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BuySubscriptionButton from '@/components/BuySubscriptionButton';
import { useCheckSubscriptionStatusQuery } from '@/features/api/subscriptionApi';
import { useSelector } from 'react-redux';

const CareerSkills = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user } = useSelector((store) => store.auth);
  
  // Check subscription status for Generative AI
  const { data: subscriptionStatus } = useCheckSubscriptionStatusQuery('generative-ai', {
    skip: !user,
  });

  // Check subscription status for IT Certifications
  const { data: itCertSubscriptionStatus } = useCheckSubscriptionStatusQuery('it-certifications', {
    skip: !user,
  });

  // Check subscription status for Data Science
  const { data: dataScienceSubscriptionStatus } = useCheckSubscriptionStatusQuery('data-science', {
    skip: !user,
  });

  const categories = [
    {
      id: 1,
      title: 'Generative AI',
      students: '17M+',
      price: '₹499',
      image: '/generative-ai.webp',
      bgColor: 'bg-gradient-to-br from-gray-200 to-gray-300'
    },
    {
      id: 2,
      title: 'IT Certifications',
      students: '14M+',
      price: '₹599',
      image: '/certifications.webp',
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      id: 3,
      title: 'Data Science',
      students: '8.1M+',
      price: '₹699',
      image: '/data-science.webp',
      bgColor: 'bg-gradient-to-br from-purple-200 to-blue-300'
    },
    {
      id: 4,
      title: 'Gemini AI',
      students: '12M+',
      image: '/Gemini.webp',
      bgColor: 'bg-gradient-to-br from-green-400 to-teal-500'
    }
  ];

  const cardsPerView = 3;
  const maxSlide = Math.ceil(categories.length / cardsPerView) - 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : maxSlide));
  };

  const handleCategoryClick = (category) => {
    if (category.title === 'Generative AI') {
      // Check if user has active subscription
      if (subscriptionStatus?.hasActiveSubscription) {
        navigate('/generate-ai');
      } else {
        // Show subscription modal if not authenticated or no active subscription
        if (!user) {
          navigate('/login');
        } else {
          setSelectedCategory(category);
          setShowSubscriptionModal(true);
        }
      }
    } else if (category.title === 'IT Certifications') {
      // Check if user has active subscription for IT Certifications
      if (itCertSubscriptionStatus?.hasActiveSubscription) {
        navigate('/it-certifications');
      } else {
        // Show subscription modal if not authenticated or no active subscription
        if (!user) {
          navigate('/login');
        } else {
          setSelectedCategory(category);
          setShowSubscriptionModal(true);
        }
      }
    } else if (category.title === 'Data Science') {
      // Check if user has active subscription for Data Science
      if (dataScienceSubscriptionStatus?.hasActiveSubscription) {
        navigate('/data-science');
      } else {
        // Show subscription modal if not authenticated or no active subscription
        if (!user) {
          navigate('/login');
        } else {
          setSelectedCategory(category);
          setShowSubscriptionModal(true);
        }
      }
    } else {
      navigate(`/course/search?query=${encodeURIComponent(category.title)}`);
    }
  };

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-gray-900 dark:text-white leading-tight">
            Learn essential career and life skills
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            E-Learning helps you build in-demand skills fast and advance your career with expert-led courses.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="min-w-[calc(100%-0px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] flex-shrink-0"
                >
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800"
                  >
                    {/* Image Section */}
                    <div className={`relative h-64 ${category.bgColor} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={category.image}
                          alt={category.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 h-32 flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-medium">{category.students}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.title}
                        </h3>
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      {category.price && (
                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {category.price} / month
                        </div>
                      )}
                      {!category.price && (
                        <div className="h-7"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? 'w-8 bg-blue-600'
                      : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              disabled={currentSlide === maxSlide}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Subscription Modal */}
        {showSubscriptionModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
              <button
                onClick={() => {
                  setShowSubscriptionModal(false);
                  setSelectedCategory(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Subscribe to {selectedCategory.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedCategory.title === 'Generative AI'
                    ? 'Get unlimited access to Generative AI tools and courses'
                    : selectedCategory.title === 'IT Certifications'
                    ? 'Get comprehensive IT certification courses and exam preparation'
                    : 'Master data science with comprehensive courses and real-world projects'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6">
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {selectedCategory.title === 'Generative AI' ? '₹499' : selectedCategory.title === 'IT Certifications' ? '₹599' : '₹699'}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">/ month</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {selectedCategory.title === 'Generative AI' ? (
                    <>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Unlimited AI tool access
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Premium courses and tutorials
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Priority support
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Cancel anytime
                      </li>
                    </>
                  ) : selectedCategory.title === 'IT Certifications' ? (
                    <>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        AWS, Azure, GCP certification courses
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Practice exams and mock tests
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Hands-on labs and projects
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Study guides and resources
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Career guidance and placement support
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Python, R, SQL comprehensive courses
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Machine Learning & AI algorithms
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Data visualization & analytics tools
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Real-world datasets & projects
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Industry expert mentorship
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <BuySubscriptionButton
                subscriptionType={selectedCategory.title === 'Generative AI' ? 'generative-ai' : selectedCategory.title === 'IT Certifications' ? 'it-certifications' : 'data-science'}
                amount={selectedCategory.title === 'Generative AI' ? 499 : selectedCategory.title === 'IT Certifications' ? 599 : 699}
                title={`${selectedCategory.title} Subscription`}
              />
              
              <button
                onClick={() => {
                  setShowSubscriptionModal(false);
                  setSelectedCategory(null);
                }}
                className="w-full mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerSkills;
