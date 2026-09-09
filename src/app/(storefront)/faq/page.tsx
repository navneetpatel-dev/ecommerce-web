import { redirect } from 'next/navigation'
import { PATHS } from '@/shared/constants/paths/paths'

/** FAQ lives inside the Help Centre for a single, detailed support surface. */
export default function FaqRedirect() {
  redirect(PATHS.help)
}
