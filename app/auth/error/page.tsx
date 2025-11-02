import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthErrorPage() {
  return (
    <Card className="border-destructive/20 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center text-destructive">Authentication Error</CardTitle>
        <CardDescription className="text-center">Something went wrong during authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            There was an issue with your authentication. Please try again or contact support if the problem persists.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Link href="/auth/login" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Try Again</Button>
          </Link>
          <Link href="/" className="block">
            <Button
              variant="outline"
              className="w-full border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
