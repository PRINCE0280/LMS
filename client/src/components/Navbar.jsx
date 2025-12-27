import { Menu, School } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import DarkMode from '@/DarkMode'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

import { Separator } from '@radix-ui/react-dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '@/features/api/authapi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import AuthModal from './AuthModal'

const Navbar = () => {
  const {user} = useSelector((store) => store.auth);
  const [logoutUser , {data, isSuccess}] = useLogoutUserMutation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const logoutHandler = async () => {
    await logoutUser();
  }
   useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    }
  } , [isSuccess]);


  return (
    <div className="fixed top-0 inset-x-0 z-10 border-b border-b-gray-200 dark:border-b-gray-800 bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop header */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-4 h-16 px-4">
        <div className="flex items-center gap-2">
          <School size={30} />
         <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}> <h1 className="font-extrabold text-2xl">E-Learning</h1>
         </Link>
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png" } alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              {/* FIX: use onSelect to close automatically */}
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {
                  user?.role === 'instructor' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )
                }
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>Log in</Button>
              <Button onClick={() => setIsAuthModalOpen(true)}>Sign up</Button>
            </div>
          )}

          {/* FIX: wrap DarkMode toggle so dropdown closes */}
          <div onClick={(e) => e.stopPropagation()}>
            <DarkMode />
          </div>
        </div>
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      {/* Mobile header */}
      <div className="flex md:hidden items-center justify-between h-16 px-4">
        <h1 className="font-extrabold text-lg">E-Learning</h1>
        <MobileNavbar user={user} setIsAuthModalOpen={setIsAuthModalOpen} />
      </div>
    </div>
  )
}

export default Navbar

const MobileNavbar = ({ user, setIsAuthModalOpen }) => {
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col px-6 pt-4">
        <SheetHeader className="flex flex-row items-center justify-between mt-2 pr-8">
          <SheetTitle><Link to="/">E-Learning</Link></SheetTitle>
          {/* FIX: prevent propagation to avoid re-triggering sheet */}
          <div onClick={(e) => e.stopPropagation()}>
            <DarkMode />
          </div>
        </SheetHeader>

        <Separator className="my-3" />

        <nav className="flex flex-col space-y-2">
          {user ? (
            <>
              <SheetClose asChild>
                <Link
                  to="/my-learning"
                  className="px-3 py-2 text-sm rounded-md text-left hover:bg-accent hover:text-accent-foreground"
                >
                  My Learning
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="/profile"
                  className="px-3 py-2 text-sm rounded-md text-left hover:bg-accent hover:text-accent-foreground"
                >
                  Edit Profile
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <button
                  onClick={logoutHandler}
                  className="px-3 py-2 text-sm rounded-md text-left hover:bg-accent hover:text-accent-foreground w-full"
                >
                  Log Out
                </button>
              </SheetClose>

              {user?.role === 'instructor' && (
                <SheetClose asChild>
                  <Link to="/admin/dashboard">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                </SheetClose>
              )}
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Log in
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button 
                  className="w-full"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign up
                </Button>
              </SheetClose>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
