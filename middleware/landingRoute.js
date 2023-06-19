export default function({ route, redirect }) {
    if (['/', '/dashboards'].includes(route.path)) {
        return redirect(process.env.dashboardPath)
    }
}
