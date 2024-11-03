// this component (MethodCall) is used to call react method in our methods.ts file
import { useState } from 'react'

interface MethodCallInterface {
  methodFunction: () => Promise<void>
  text: string
}
// here we are returning a MethodCall(button component) but we set loading and the function to be executed upon button click
// the method passed in (methodFunction) will not execute unless a button is clicked
const MethodCall = ({ methodFunction, text }: MethodCallInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  // this is the method we are passing to the button onclick.
  // the reaseon we pass callMethodFunction() instead of methodFunction() is to set loading indicator
  const callMethodFunction = async () => {
    setLoading(true)
    await methodFunction()
    setLoading(false)
  }

  return (
    <button data-test-id="send-algo" className="btn btn-primary rounded-3xl mt-4" onClick={callMethodFunction}>
      {loading ? <span className="loading loading-spinner" /> : text}
    </button>
  )
}

export default MethodCall
