export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <h3 className="font-semibold text-lg">SOUL SYNC</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Your personal mental health companion, providing support and tools for your wellness journey.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 SOUL SYNC. All rights reserved.</p>
          <p>Developed under GENVO LABS</p>
        </div>
      </div>
    </footer>
  )
}
