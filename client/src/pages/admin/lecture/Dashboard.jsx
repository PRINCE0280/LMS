import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const Dashboard = () => {

      const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

      if (isLoading) return <h1>Loading...</h1>
      if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>

      //
      const { purchasedCourse } = data || [];

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
      return (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                              <CardTitle>Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                              <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
                        </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                              <CardTitle>Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                              <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
                        </CardContent>
                  </Card>

                  {/* Course Sales Analysis */}
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 lg:col-span-4">
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