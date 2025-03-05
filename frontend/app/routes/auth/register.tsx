import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardFooter, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function Register() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">Register</h2>
        </CardHeader>
        <CardDescription className="px-6">
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" placeholder="Enter your email" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input type="password" placeholder="Enter your password" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input type="password" placeholder="Confirm your password" required />
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardDescription>
        <CardFooter className="text-center justify-center">
          <p>
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
