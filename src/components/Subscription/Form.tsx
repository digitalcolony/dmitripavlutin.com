import { useState, useRef } from 'react'
import * as styles from './Form.module.scss'

interface SubscriptionFormProps {
  emailSubscriptionService: EmailSubscriptionService;
}

export const SUBSCRIBERS_COUNT = 7067

type SubscriptionStatus = 'not_subscribed' | 'subscribed' | 'subscription_error'

export function SubscriptionForm({
  emailSubscriptionService: { endpoint },
}: SubscriptionFormProps) {
  const [subscribedStatus, setSubscribedStatus] = useState<SubscriptionStatus>('not_subscribed')
  const emailInput = useRef<HTMLInputElement>()

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('fields[email]', emailInput.current.value)
    let success = false
    try {
      const response = await fetch(endpoint, {
        method: 'post',
        body: formData,
        mode: 'cors'
      })
      success = response.ok
    } catch (e) { }
    setSubscribedStatus(success ? 'subscribed' : 'subscription_error')
  }

  let content: JSX.Element = null
  if (subscribedStatus === 'not_subscribed') {
    content = (
      <form onSubmit={onSubmit} data-testid="form" className={styles.form}>
        <div className={styles.emailField}>
          <input
            ref={emailInput}
            data-testid="email"
            type="email"
            required
            tabIndex={0}
            className={styles.email}
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" name="subscribe" className={styles.submit}>
          Subscribe
        </button>
      </form>
    )
  } else if (subscribedStatus === 'subscribed') {
    content = <div>Thank you! An email confirmation message has been sent to your inbox.</div>
  } else if (subscribedStatus === 'subscription_error') {
    content = <div>Ooops! An error occured. Please try again later...</div>
  }

  return (
    <div className={styles.subscriptionForm}>
      <div className={styles.message}>
        <h2>Quality posts into your inbox</h2>
        <p>I regularly publish posts containing: </p>
        <ul>
          <li>Important JavaScript concepts explained in simple words</li>
          <li>Overview of new JavaScript features</li>
          <li>How to use TypeScript and typing</li>
          <li>Software design and good coding practices</li>
        </ul>
        <p>Subscribe to my newsletter to get them right into your inbox.</p>
      </div>
      {content}
      <div className={styles.subscribersCount}>Join {SUBSCRIBERS_COUNT} other subscribers.</div>
    </div>
  )
}