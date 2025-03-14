import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useLogin } from "~/hooks/useLogin";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">Login</h2>
        </CardHeader>
        <CardDescription className="px-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardDescription>
        <CardFooter className="text-center justify-center">
          <p>
            Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
