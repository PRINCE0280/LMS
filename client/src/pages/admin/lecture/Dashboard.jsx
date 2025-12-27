import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, FileText, ClipboardList, BookOpen, TrendingUp } from "lucide-react";

const Dashboard = () => {
      const navigate = useNavigate();
      const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();
      const { data: coursesData, isLoading: coursesLoading } = useGetCreatorCoursesQuery();

      if (isLoading || coursesLoading) return <h1>Loading...</h1>
      if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>

      const { purchasedCourse } = data || [];
      const myCourses = coursesData?.courses || [];

      // Aggregate data by course to show total sales per course
      const courseMap = {};
      purchasedCourse
            .filter((course) => course.courseId)
            .forEach((purchase) => {
                  const courseId = purchase.courseId._id;
                  const courseName = purchase.courseId.courseTitle;
                  const coursePrice = purchase.courseId.CoursePrice;
                  
                  if (!courseMap[courseId]) {
                        courseMap[courseId] = {
                              name: courseName.length > 20 ? courseName.substring(0, 20) + '...' : courseName,
                              price: coursePrice,
                              sales: 0,
                              revenue: 0
                        };
                  }
                  courseMap[courseId].sales += 1;
                  courseMap[courseId].revenue += purchase.amount || 0;
            });

      const courseData = Object.values(courseMap);

      const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);

      const totalSales = purchasedCourse.length;
      
      // Calculate total students across all courses
      const totalStudents = myCourses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0);
      
      return (
            <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                              <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
                              </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                              <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-3xl font-bold text-green-600">₹{totalRevenue}</p>
                              </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                              <CardHeader>
                                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-3xl font-bold text-purple-600">{totalStudents}</p>
                              </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                              <CardHeader>
                                    <CardTitle className="text-sm font-medium">My Courses</CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-3xl font-bold text-orange-600">{myCourses.length}</p>
                              </CardContent>
                        </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                              onClick={() => navigate('/admin/courses')}>
                              <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                          <BookOpen className="w-5 h-5 text-blue-600" />
                                          Manage Courses
                                    </CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">View and edit your courses, lectures, and content</p>
                              </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                              onClick={() => myCourses[0] && navigate(`/admin/course/${myCourses[0]._id}/students`)}>
                              <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                          <Users className="w-5 h-5 text-purple-600" />
                                          Student Management
                                    </CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">View enrolled students and track their progress</p>
                                    {myCourses.length === 0 && <p className="text-sm text-red-500 mt-2">Create a course first</p>}
                              </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                              onClick={() => myCourses[0] && navigate(`/admin/course/${myCourses[0]._id}/assignments`)}>
                              <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                          <FileText className="w-5 h-5 text-green-600" />
                                          Assignments
                                    </CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">Create and grade student assignments</p>
                                    {myCourses.length === 0 && <p className="text-sm text-red-500 mt-2">Create a course first</p>}
                              </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                              onClick={() => myCourses[0] && navigate(`/admin/course/${myCourses[0]._id}/quizzes`)}>
                              <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                          <ClipboardList className="w-5 h-5 text-orange-600" />
                                          Quizzes
                                    </CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">Create quizzes and view student results</p>
                                    {myCourses.length === 0 && <p className="text-sm text-red-500 mt-2">Create a course first</p>}
                              </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 col-span-1 sm:col-span-2">
                              <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                          <TrendingUp className="w-5 h-5 text-blue-600" />
                                          Course Performance
                                    </CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <div className="space-y-2">
                                          {myCourses.slice(0, 3).map((course) => (
                                                <div key={course._id} 
                                                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                      onClick={() => navigate(`/admin/courses/${course._id}`)}>
                                                      <span className="font-medium">{course.courseTitle}</span>
                                                      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                            <span>{course.enrolledStudents?.length || 0} students</span>
                                                            <span>₹{course.CoursePrice || 0}</span>
                                                      </div>
                                                </div>
                                          ))}
                                          {myCourses.length === 0 && (
                                                <p className="text-gray-500 text-center py-4">No courses yet. Create your first course!</p>
                                          )}
                                          {myCourses.length > 3 && (
                                                <Button 
                                                      variant="outline" 
                                                      className="w-full mt-2"
                                                      onClick={() => navigate('/admin/courses')}
                                                >
                                                      View All Courses
                                                </Button>
                                          )}
                                    </div>
                              </CardContent>
                        </Card>
                  </div>

                  {/* Course Sales Analysis */}
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                              <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                    Course Sales & Revenue
                              </CardTitle>
                        </CardHeader>
                        <CardContent>
                              <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={courseData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                          <XAxis
                                                dataKey="name"
                                                stroke="#6b7280"
                                                angle={-45}
                                                textAnchor="end"
                                                interval={0}
                                                tick={{ fontSize: 11 }}
                                          />
                                          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                                          <Tooltip 
                                                formatter={(value, name) => {
                                                      if (name === "revenue" || name === "price") {
                                                            return [`₹${value}`, name === "revenue" ? "Revenue" : "Price"];
                                                      }
                                                      return [value, name === "sales" ? "Total Sales" : name];
                                                }}
                                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e0e0e0' }}
                                          />
                                          <Legend 
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                formatter={(value) => {
                                                      if (value === "revenue") return "Total Revenue (₹)";
                                                      if (value === "sales") return "Number of Sales";
                                                      return value;
                                                }}
                                          />
                                          <Bar dataKey="revenue" fill="#4a90e2" radius={[8, 8, 0, 0]} />
                                          <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                              </ResponsiveContainer>
                        </CardContent>
                  </Card>
            </div>
      );
};

export default Dashboard;