import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { LogIn, UserPlus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

const Auth = () => {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const { error } = await signIn(loginEmail, loginPassword)
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      navigate('/')
    }
    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupEmail || !signupPassword || !confirmPassword || !fullName) {
      toast.error('Please fill in all fields')
      return
    }

    if (signupPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await signUp(signupEmail, signupPassword, fullName)
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.')
      } else {
        toast.error(error.message)
      }
    } else {
      toast.success('Account created! Please check your email to verify your account.')
      navigate('/profile-setup')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Novela
          </h1>
          <p className="text-muted-foreground mt-2">Your Personal Style Assistant</p>
        </div>

        <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-card">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to your account to continue styling</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join Novela and start building your virtual wardrobe</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          By continuing, you agree to our terms of service and privacy policy.
        </div>
      </div>
    </div>
  )
}

export default Auth