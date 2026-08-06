import { redirect } from 'next/navigation'

/** FAQ lives inside the Help Centre for a single, detailed support surface. */
export default function FaqRedirect() {
  redirect('/help')
}
