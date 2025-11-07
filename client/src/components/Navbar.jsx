import { Menu, School } from 'lucide-react'
import React from 'react'
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
import { Link } from 'react-router-dom'

const Navbar = () => {
  const user = true

  return (
    <div className="fixed top-0 inset-x-0 z-10 border-b border-b-gray-200 dark:border-b-gray-800 bg-white dark:bg-[#0A0A0A] transition-colors duration-200">
      {/* Desktop header */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-4 h-16 px-4">
        <div className="flex items-center gap-2">
          <School size={30} />
          <h1 className="font-extrabold text-2xl">E-Learning</h1>
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
                  <DropdownMenuItem asChild>
                    <Link to="/logout">Log out</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline">Log in</Button>
              <Button>Sign up</Button>
            </div>
          )}

          {/* FIX: wrap DarkMode toggle so dropdown closes */}
          <div onClick={(e) => e.stopPropagation()}>
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex md:hidden items-center justify-between h-16 px-4">
        <h1 className="font-extrabold text-lg">E-Learning</h1>
        <MobileNavbar />
      </div>
    </div>
  )
}

export default Navbar

const MobileNavbar = () => {
  const role = 'instructor'

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-gray-200 hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col px-6 pt-4">
        <SheetHeader className="flex flex-row items-center justify-between mt-2 pr-8">
          <SheetTitle>E-Learning</SheetTitle>
          {/* FIX: prevent propagation to avoid re-triggering sheet */}
          <div onClick={(e) => e.stopPropagation()}>
            <DarkMode />
          </div>
        </SheetHeader>

        <Separator className="my-3" />

        <nav className="flex flex-col space-y-2">
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
            <Link
              to="/logout"
              className="px-3 py-2 text-sm rounded-md text-left hover:bg-accent hover:text-accent-foreground"
            >
              Log Out
            </Link>
          </SheetClose>

          {role === 'instructor' && (
            <SheetClose asChild>
              <Button className="w-full">Dashboard</Button>
            </SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
