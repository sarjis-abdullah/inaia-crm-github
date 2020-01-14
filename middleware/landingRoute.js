export default function({ route, redirect }) {
    // console.log('current route', route)
    if (['/', '/dashboards'].includes(route.path)) {
        return redirect('/dashboards/classic')
    }
}
