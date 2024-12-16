import { PlusCircle } from "lucide-react"

import { Button } from "./ui/button"

export const AddCardButton = () => {
  return (
    <Button variant="outline" size="icon">
      <PlusCircle className="h-4 w-4" />
    </Button>
  )
}
