import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetCreatorCoursesQuery } from '@/features/api/courseApi'
import { Edit, Users, FileText, ClipboardList } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'



  const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]
const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCoursesQuery();
  const navigate = useNavigate();

  if(isLoading) return <h1>Loading...</h1>
  
    

  return (
    <div className='flex-1 p-8'>
     <Button onClick={() => navigate('/admin/courses/create')}>Create a new course</Button>
     <Table>
      <TableCaption>A list of your recent courses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Thumbnail</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="w-[100px]">Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.courses.map((course) => (
          <TableRow key={course._id}>
            <TableCell>
              <img 
                src={course.CourseThumbnail || '/placeholder-course.png'} 
                alt={course.courseTitle}
                className="w-16 h-16 object-cover rounded"
              />
            </TableCell>
            <TableCell className="font-medium">{course.courseTitle}</TableCell>
            <TableCell>{course?.CoursePrice || "NA"}</TableCell>
            <TableCell><Badge>{course.isPublished ? "Published" : "Draft"}</Badge></TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => navigate(`/admin/course/${course._id}/students`)}
                  title="View Students"
                >
                  <Users className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => navigate(`/admin/course/${course._id}/assignments`)}
                  title="Manage Assignments"
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => navigate(`/admin/course/${course._id}/quizzes`)}
                  title="Manage Quizzes"
                >
                  <ClipboardList className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => navigate(`/admin/courses/${course._id}`)}
                  title="Edit Course"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}
export default CourseTable
