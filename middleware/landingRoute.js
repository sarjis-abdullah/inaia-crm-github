export default function({ route, redirect }) {
    // console.log('current route', route)
    if (['/', '/dashboards'].includes(route.fullPath)) {
        return redirect('/dashboards/classic')
    }
}
