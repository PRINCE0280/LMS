import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authapi"
import {
      Card,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
} from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"



const Login = () => {
      const [LoginInput, setLoginInput] = useState({ email: "", password: "" });

      const [registerUser, {
            data: registerData,
            error: registerError,
            isLoading: registerIsLoading,
            isSuccess: registerIsSuccess
      }] = useRegisterUserMutation();
      const [loginUser, {
            data: loginData,
            error: loginError,
            isLoading: loginIsLoading,
            isSuccess: loginIsSuccess
      }] = useLoginUserMutation();
   
      const navigate = useNavigate();
      const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
      const changeInputHandler = (e, type) => {
            const { name, value } = e.target;
            if (type === "signup") {
                  setSignupInput({ ...signupInput, [name]: value });
            } else {
                  setLoginInput({ ...LoginInput, [name]: value });
            }
      };
      const handleRegistration = async (type) => {
            const inputData = type === "signup" ? signupInput : LoginInput;
            const action = type === "signup" ? registerUser : loginUser;
            await action(inputData);

      };

                  useEffect(() => {
                               if (registerIsSuccess) {
                                     toast.success("Account Created Successfully");
                               }
                               if (registerError) {
                                     toast.error(registerError?.data?.message || "Registration failed. Please try again.");
                               }
           if(loginIsSuccess && loginData) 
           {
            toast.success(loginData.message || "Login successful!");
            navigate("/");

           }
            if(loginError)
           {
            toast.error(loginError.data.message || "Login failed. Please try again.");
           }
      }, [

            loginIsLoading,
            registerIsLoading,
           loginData,
          registerData,
          loginError,
         registerError
       ]);

      return (
            <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4">
                  <div className="w-full max-w-sm">
                        <Tabs defaultValue="login">
                              <TabsList>
                                    <TabsTrigger value="signup">Signup</TabsTrigger>
                                    <TabsTrigger value="login">Login</TabsTrigger>
                              </TabsList>
                              <TabsContent value="signup">
                                    <Card>
                                          <CardHeader>
                                                <CardTitle>Create an account</CardTitle>
                                                <CardDescription>
                                                      Enter your details below to sign up.
                                                </CardDescription>
                                          </CardHeader>
                                          <CardContent className="grid gap-6">
                                                <div className="grid gap-3">
                                                      <Label htmlFor="signup-name">Name</Label>
                                                      <Input
                                                            name="name"
                                                            placeholder="Your full name"
                                                            value={signupInput.name}
                                                            onChange={(e) => { changeInputHandler(e, "signup") }}
                                                            required
                                                      />
                                                </div>
                                                <div className="grid gap-3">
                                                      <Label htmlFor="signup-email">Email</Label>
                                                      <Input
                                                            type="email"
                                                            name="email"
                                                            placeholder="abc@example.com"
                                                            value={signupInput.email}
                                                            onChange={(e) => { changeInputHandler(e, "signup") }}
                                                            required
                                                      />
                                                </div>
                                                <div className="grid gap-3">
                                                      <Label htmlFor="signup-password">Password</Label>
                                                      <Input
                                                            type="password"
                                                            name="password"
                                                            placeholder="Eg. xyz123"
                                                            value={signupInput.password}
                                                            onChange={(e) => { changeInputHandler(e, "signup") }}
                                                            required
                                                      />
                                                </div>
                                          </CardContent>
                                          <CardFooter>
                                                <Button disabled={registerIsLoading} onClick={() => handleRegistration('signup')}>
                                                      {
                                                            registerIsLoading ?
                                                                  (
                                                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait...</>
                                                                  ) : "Signup"
                                                      }
                                                </Button>
                                          </CardFooter>
                                    </Card>
                              </TabsContent>
                              <TabsContent value="login">
                                    <Card>
                                          <CardHeader>
                                                <CardTitle>Welcome back</CardTitle>
                                                <CardDescription>
                                                      Enter your credentials to sign in.
                                                </CardDescription>
                                          </CardHeader>
                                          <CardContent className="grid gap-6">
                                                <div className="grid gap-3">
                                                      <Label htmlFor="login-email">Email</Label>
                                                      <Input
                                                            type="email"
                                                            name="email"
                                                            placeholder="you@example.com"
                                                            value={LoginInput.email}
                                                            onChange={(e) => { changeInputHandler(e, "login") }}
                                                            required
                                                      />
                                                </div>
                                                <div className="grid gap-3">
                                                      <Label htmlFor="login-password">Password</Label>
                                                      <Input
                                                            type="password"
                                                            name="password"
                                                            placeholder=""
                                                            value={LoginInput.password}
                                                            onChange={(e) => { changeInputHandler(e, "login") }}
                                                            required
                                                      />
                                                </div>
                                          </CardContent>
                                          <CardFooter>
                                                <Button disabled={loginIsLoading} onClick={() => handleRegistration('login')}>
                                                      {
                                                            loginIsLoading ?
                                                                  (
                                                                        <>
                                                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait...
                                                                        </>
                                                                  ) :
                                                                  "Login"
                                                      }
                                                </Button>
                                          </CardFooter>
                                    </Card>
                              </TabsContent>
                        </Tabs>
                  </div>
            </div>
      )
}
export default Login