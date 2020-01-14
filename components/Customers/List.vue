<template>
    <div>
        <vs-table stripe :data="data">
            <template slot="header">
                <h3> Customer List </h3>
                <!-- <vs-button color="primary" type="gradient" icon="person_add" @click="newCustomer"> add customer </vs-button> -->
            </template>

            <template slot="thead">
                <vs-th>Contact ID</vs-th>
                <vs-th>Account Number</vs-th>
                <vs-th>Name</vs-th>
                <vs-th>Email</vs-th>
                <vs-th>Action</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :key="i" v-for="(tr, i) in data">
                    <vs-td :data="tr.id">{{ tr.id }}</vs-td>
                    <vs-td :data="tr.account ? tr.account.account_number : 'n/a'">{{ tr.account ? tr.account.account_number : 'n/a' }}</vs-td>
                    <vs-td :data="tr.name">{{ tr.name }}</vs-td>
                    <vs-td :data="tr.account ? tr.account.email : 'n/a'">{{ tr.account ? tr.account.email : 'n/a' }}</vs-td>
                    <vs-td><nuxt-link :to="'/customers/edit/'+tr.id">Edit</nuxt-link></vs-td>
                </vs-tr>
            </template>

        </vs-table>
        <template>
            <div>
                <vs-pagination :total="totalPages" v-model="page"></vs-pagination>
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data() {
        return {
            data: [
                {
                id: "GD6220002",
                name: "Haque, Enamul",
                action: "test"
                }
            ],
            initiated: false,
            perPage: 5,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" }
        }
    },
    computed: {
        searchQuery() {
            return (
                `&page=${this.page ? this.page : 1}` +
                `&per_page=${this.perPage ? this.perPage : 20}`
            )
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage)
        }
    },
    watch: {
        searchQuery: {
            handler() {
                this.fetchClientData(this.searchQuery)
            },
            immediate: true
        }
    },
    mounted() {
        this.fetchClientData(this.searchQuery)
    },
    methods: {
        fetchClientData(pageQuery) {
            this.$store
                .dispatch("clients/initClientData", pageQuery)
                .then(response => {
                    this.data = response.data.data
                    console.log('data', this.data)
                    this.totalTableData = response.data.meta.total
                })
        },
        newCustomer() {
            this.$router.push('/customers/add')
        }
    }
}

// export default {
//   data: () => ({
//     users: [
//       {
//         id: 1,
//         name: "Leanne Graham",
//         username: "Bret",
//         email: "Sincere@april.biz",
//         website: "hildegard.org"
//       },
//       {
//         id: 2,
//         name: "Ervin Howell",
//         username: "Antonette",
//         email: "Shanna@melissa.tv",
//         website: "anastasia.net"
//       },
//       {
//         id: 3,
//         name: "Clementine Bauch",
//         username: "Samantha",
//         email: "Nathan@yesenia.net",
//         website: "ramiro.info"
//       },
//       {
//         id: 4,
//         name: "Patricia Lebsack",
//         username: "Karianne",
//         email: "Julianne.OConner@kory.org",
//         website: "kale.biz"
//       },
//       {
//         id: 5,
//         name: "Chelsey Dietrich",
//         username: "Kamren",
//         email: "Lucio_Hettinger@annie.ca",
//         website: "demarco.info"
//       },
//       {
//         id: 6,
//         name: "Mrs. Dennis Schulist",
//         username: "Leopoldo_Corkery",
//         email: "Karley_Dach@jasper.info",
//         website: "ola.org"
//       },
//       {
//         id: 7,
//         name: "Kurtis Weissnat",
//         username: "Elwyn.Skiles",
//         email: "Telly.Hoeger@billy.biz",
//         website: "elvis.io"
//       },
//       {
//         id: 8,
//         name: "Nicholas Runolfsdottir V",
//         username: "Maxime_Nienow",
//         email: "Sherwood@rosamond.me",
//         website: "jacynthe.com"
//       },
//       {
//         id: 9,
//         name: "Glenna Reichert",
//         username: "Delphine",
//         email: "Chaim_McDermott@dana.io",
//         website: "conrad.com"
//       },
//       {
//         id: 10,
//         name: "Clementina DuBuque",
//         username: "Moriah.Stanton",
//         email: "Rey.Padberg@karina.biz",
//         website: "ambrose.net"
//       }
//     ]
//   })
// }
</script>