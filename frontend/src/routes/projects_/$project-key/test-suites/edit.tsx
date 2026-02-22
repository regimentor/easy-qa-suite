import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects_/$project-key/test-suites/edit')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/projects_/$project-key/test-suites/edit"!</div>
}
