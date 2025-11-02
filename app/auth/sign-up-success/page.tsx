import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center text-primary">Check Your Email</CardTitle>
        <CardDescription className="text-center">We've sent you a confirmation link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Please check your email and click the confirmation link to verify your account. Once confirmed, you can sign
          in and start your wellness journey.
        </p>

        <div className="space-y-2">
          <Link href="/auth/login" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Back to Sign In</Button>
          </Link>
          <Link href="/" className="block">
            <Button
              variant="outline"
              className="w-full border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
            >
              Continue as Guest
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
