import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { 
      useSendRegisterOTPMutation,
      useSendLoginOTPMutation,
      useVerifyOTPMutation,
      useVerifyLoginOTPMutation,
      useResendOTPMutation
} from "@/features/api/authapi"
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
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"



const Login = () => {
      const [LoginInput, setLoginInput] = useState({ email: "", password: "" });
      const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
      const [otpInput, setOtpInput] = useState("");
      const [showOTPVerification, setShowOTPVerification] = useState(false);
      const [isLoginMode, setIsLoginMode] = useState(false);
      const [countdown, setCountdown] = useState(0);

      const [sendRegisterOTP, {
            error: registerOtpError,
            isLoading: registerOtpIsLoading,
            isSuccess: registerOtpIsSuccess
      }] = useSendRegisterOTPMutation();

      const [sendLoginOTP, {
            data: loginOtpData,
            error: loginOtpError,
            isLoading: loginOtpIsLoading,
            isSuccess: loginOtpIsSuccess
      }] = useSendLoginOTPMutation();

      const [verifyOTP, {
            data: verifyData,
            error: verifyError,
            isLoading: verifyIsLoading,
            isSuccess: verifyIsSuccess
      }] = useVerifyOTPMutation();

      const [verifyLoginOTP, {
            data: verifyLoginData,
            error: verifyLoginError,
            isLoading: verifyLoginIsLoading,
            isSuccess: verifyLoginIsSuccess
      }] = useVerifyLoginOTPMutation();

      const [resendOTP, {
            isLoading: resendIsLoading,
            isSuccess: resendIsSuccess
      }] = useResendOTPMutation();
   
      const navigate = useNavigate();
      
      // Countdown timer for resend OTP
      useEffect(() => {
            let timer;
            if (countdown > 0) {
                  timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            }
            return () => clearTimeout(timer);
      }, [countdown]);

      const changeInputHandler = (e, type) => {
            const { name, value } = e.target;
            if (type === "signup") {
                  setSignupInput({ ...signupInput, [name]: value });
            } else {
                  setLoginInput({ ...LoginInput, [name]: value });
            }
      };

      const handleSendOTP = async () => {
            if (!signupInput.name || !signupInput.email || !signupInput.password) {
                  toast.error("All fields are required");
                  return;
            }
            if (signupInput.password.length < 6) {
                  toast.error("Password must be at least 6 characters");
                  return;
            }
            setIsLoginMode(false);
            await sendRegisterOTP(signupInput);
      };

      const handleVerifyOTP = async () => {
            if (!otpInput || otpInput.length !== 6) {
                  toast.error("Please enter a valid 6-digit OTP");
                  return;
            }
            if (isLoginMode) {
                  await verifyLoginOTP({ email: LoginInput.email, otp: otpInput });
            } else {
                  await verifyOTP({ email: signupInput.email, otp: otpInput });
            }
      };

      const handleResendOTP = async () => {
            const email = isLoginMode ? LoginInput.email : signupInput.email;
            await resendOTP({ email });
            setCountdown(60);
      };

      const handleLogin = async () => {
            if (!LoginInput.email || !LoginInput.password) {
                  toast.error("All fields are required");
                  return;
            }
            setIsLoginMode(true);
            await sendLoginOTP(LoginInput);
      };

      useEffect(() => {
            if (registerOtpIsSuccess) {
                  toast.success("OTP sent to your email successfully!");
                  setShowOTPVerification(true);
                  setCountdown(60);
            }
            if (registerOtpError) {
                  toast.error(registerOtpError?.data?.message || "Failed to send OTP");
            }
      }, [registerOtpIsSuccess, registerOtpError]);

      useEffect(() => {
            if (loginOtpIsSuccess) {
                  // Check if instructor logged in directly (has user object)
                  if (loginOtpData?.user) {
                        toast.success(loginOtpData.message || "Login successful!");
                        navigate("/");
                  } else {
                        // Student needs OTP verification
                        toast.success("OTP sent to your email successfully!");
                        setShowOTPVerification(true);
                        setCountdown(60);
                  }
            }
            if (loginOtpError) {
                  toast.error(loginOtpError?.data?.message || "Failed to send OTP");
            }
      }, [loginOtpIsSuccess, loginOtpError, loginOtpData, navigate]);

      useEffect(() => {
            if (verifyIsSuccess && verifyData) {
                  toast.success("Account verified and logged in successfully!");
                  navigate("/");
            }
            if (verifyError) {
                  toast.error(verifyError?.data?.message || "Invalid OTP");
            }
      }, [verifyIsSuccess, verifyError, verifyData, navigate]);

      useEffect(() => {
            if (verifyLoginIsSuccess && verifyLoginData) {
                  toast.success("Login successful!");
                  navigate("/");
            }
            if (verifyLoginError) {
                  toast.error(verifyLoginError?.data?.message || "Invalid OTP");
            }
      }, [verifyLoginIsSuccess, verifyLoginError, verifyLoginData, navigate]);

      useEffect(() => {
            if (resendIsSuccess) {
                  toast.success("OTP resent successfully!");
            }
      }, [resendIsSuccess]);

      return (
            <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4">
                  <div className="w-full max-w-sm">
                        {showOTPVerification ? (
                              // OTP Verification Screen
                              <Card>
                                    <CardHeader className="text-center">
                                          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                                          <CardDescription>
                                                We've sent a 6-digit OTP to<br />
                                                <span className="font-semibold text-foreground">{isLoginMode ? LoginInput.email : signupInput.email}</span>
                                          </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                          <div className="grid gap-3">
                                                <Label htmlFor="otp" className="text-center">Enter OTP</Label>
                                                <Input
                                                      id="otp"
                                                      type="text"
                                                      maxLength={6}
                                                      placeholder="000000"
                                                      value={otpInput}
                                                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                                      onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && otpInput.length === 6) {
                                                                  handleVerifyOTP();
                                                            }
                                                      }}
                                                      className="text-center text-2xl tracking-widest font-semibold"
                                                      required
                                                      autoFocus
                                                />
                                                <p className="text-xs text-muted-foreground text-center">
                                                      OTP expires in 10 minutes
                                                </p>
                                          </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-3">
                                          <Button 
                                                className="w-full" 
                                                disabled={verifyIsLoading || verifyLoginIsLoading || otpInput.length !== 6} 
                                                onClick={handleVerifyOTP}
                                          >
                                                {(verifyIsLoading || verifyLoginIsLoading) ? (
                                                      <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Verifying...
                                                      </>
                                                ) : "Verify OTP"}
                                          </Button>

                                          <div className="flex items-center justify-center gap-2 text-sm w-full">
                                                <span className="text-muted-foreground">Didn't receive OTP?</span>
                                                {countdown > 0 ? (
                                                      <span className="text-muted-foreground">Resend in {countdown}s</span>
                                                ) : (
                                                      <Button
                                                            variant="link"
                                                            className="p-0 h-auto"
                                                            onClick={handleResendOTP}
                                                            disabled={resendIsLoading}
                                                      >
                                                            {resendIsLoading ? "Sending..." : "Resend OTP"}
                                                      </Button>
                                                )}
                                          </div>

                                          <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => {
                                                      setShowOTPVerification(false);
                                                      setOtpInput("");
                                                      setIsLoginMode(false);
                                                }}
                                          >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to {isLoginMode ? "Login" : "Signup"}
                                          </Button>
                                    </CardFooter>
                              </Card>
                        ) : (
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
                                                            onKeyDown={(e) => {
                                                                  if (e.key === 'Enter') {
                                                                        handleSendOTP();
                                                                  }
                                                            }}
                                                            required
                                                      />
                                                </div>
                                          </CardContent>
                                          <CardFooter>
                                                <Button disabled={registerOtpIsLoading} onClick={handleSendOTP}>
                                                      {
                                                            registerOtpIsLoading ?
                                                                  (
                                                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending OTP...</>
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
                                                            onKeyDown={(e) => {
                                                                  if (e.key === 'Enter') {
                                                                        handleLogin();
                                                                  }
                                                            }}
                                                            required
                                                      />
                                                </div>
                                          </CardContent>
                                          <CardFooter>
                                                <Button disabled={loginOtpIsLoading} onClick={handleLogin}>
                                                      {
                                                            loginOtpIsLoading ?
                                                                  (
                                                                        <>
                                                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending OTP...
                                                                        </>
                                                                  ) :
                                                                  "Login"
                                                      }
                                                </Button>
                                          </CardFooter>
                                    </Card>
                              </TabsContent>
                        </Tabs>
                        )}
                  </div>
            </div>
      )
}
export default Login