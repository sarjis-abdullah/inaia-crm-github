<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
        /////////////////
        Expandable Data Table
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Expandable Data Table
          <vs-button class="ml-auto p-0" @click="expandtable=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p
          class="card-subtitle"
        >You can add the functionality of expanding a tr to visualize more data to make a structure of data or more complex functionalities</p>

        <div class="border">
          <vs-table :data="users">
            <template slot="thead">
              <vs-th>Email</vs-th>
              <vs-th>Name</vs-th>
              <vs-th>Website</vs-th>
              <vs-th>Nro</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="tr.email">{{tr.email}}</vs-td>

                <vs-td :data="tr.username">{{tr.name}}</vs-td>

                <vs-td :data="tr.website">{{tr.website}}</vs-td>

                <vs-td :data="tr.id">{{tr.id}}</vs-td>

                <template class="expand-user" slot="expand">
                  <div class="con-expand-users w-100">
                    <div class="con-btns-user d-flex align-items-center">
                      <div class="con-userx d-flex align-items-center">
                        <vs-avatar
                          :badge="tr.id"
                          size="45px"
                          :src="`https://randomuser.me/api/portraits/women/${indextr}.jpg`"
                        />
                        <span>{{ tr.name }}</span>
                      </div>

                      <div class="btn-alignment ml-auto">
                        <vs-button vs-type="border" size="small" icon="phone_in_talk"></vs-button>
                        <vs-button vs-type="gradient" size="small" color="success" icon="send"></vs-button>
                        <vs-button vs-type="flat" size="small" color="danger" icon="delete_sweep"></vs-button>
                      </div>
                    </div>
                    <vs-list>
                      <vs-list-item icon="mail" title="Email" :subtitle="tr.email"></vs-list-item>
                      <vs-list-item icon="check" title="Website" :subtitle="tr.website"></vs-list-item>
                    </vs-list>
                  </div>
                </template>
              </vs-tr>
            </template>
          </vs-table>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="expandtable">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div&gt;
            &lt;vs-table
            :data=&quot;users&quot;&gt;
            &lt;template slot=&quot;header&quot;&gt;
            &lt;h3&gt;
            Users
            &lt;/h3&gt;
            &lt;/template&gt;
            &lt;template slot=&quot;thead&quot;&gt;
            &lt;vs-th&gt;
            Email
            &lt;/vs-th&gt;
            &lt;vs-th&gt;
            Name
            &lt;/vs-th&gt;
            &lt;vs-th&gt;
            Website
            &lt;/vs-th&gt;
            &lt;vs-th&gt;
            Nro
            &lt;/vs-th&gt;
            &lt;/template&gt;
            &lt;template slot-scope=&quot;{data}&quot;&gt;
            &lt;vs-tr :data=&quot;tr&quot; :key=&quot;indextr&quot; v-for=&quot;(tr, indextr) in data&quot; &gt;
            &lt;vs-td :data=&quot;tr.email&quot;&gt;
            tr.email
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;tr.username&quot;&gt;
            tr.name
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;tr.website&quot;&gt;
            tr.website
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;tr.id&quot;&gt;
            tr.id
            &lt;/vs-td&gt;
            &lt;template class=&quot;expand-user&quot; slot=&quot;expand&quot;&gt;
            &lt;div class=&quot;con-expand-users&quot;&gt;
            &lt;div class=&quot;con-btns-user&quot;&gt;
            &lt;div class=&quot;con-userx&quot;&gt;
            &lt;vs-avatar :badge=&quot;tr.id&quot; size=&quot;45px&quot; :src=&quot;`https://randomuser.me/api/portraits/women/${indextr}.jpg`&quot;/&gt;
            &lt;span&gt;
            tr.name
            &lt;/span&gt;
            &lt;/div&gt;
            &lt;div&gt;
            &lt;vs-button vs-type=&quot;border&quot; size=&quot;small&quot; icon=&quot;phone_in_talk&quot;&gt;&lt;/vs-button&gt;
            &lt;vs-button vs-type=&quot;gradient&quot; size=&quot;small&quot; color=&quot;success&quot; icon=&quot;send&quot;&gt;&lt;/vs-button&gt;
            &lt;vs-button vs-type=&quot;flat&quot; size=&quot;small&quot; color=&quot;danger&quot; icon=&quot;delete_sweep&quot;&gt;&lt;/vs-button&gt;
            &lt;/div&gt;
            &lt;/div&gt;
            &lt;vs-list&gt;
            &lt;vs-list-item icon=&quot;mail&quot; title=&quot;Email&quot; :subtitle=&quot;tr.email&quot;&gt;&lt;/vs-list-item&gt;
            &lt;vs-list-item icon=&quot;check&quot; title=&quot;Website&quot; :subtitle=&quot;tr.website&quot;&gt;&lt;/vs-list-item&gt;
            &lt;/vs-list&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;/vs-tr&gt;
            &lt;/template&gt;
            &lt;/vs-table&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data:()=&gt;({
            users:[
            {
            &quot;id&quot;: 1,
            &quot;name&quot;: &quot;Leanne Graham&quot;,
            &quot;username&quot;: &quot;Bret&quot;,
            &quot;email&quot;: &quot;Sincere@april.biz&quot;,
            &quot;website&quot;: &quot;hildegard.org&quot;,
            },
            {
            &quot;id&quot;: 2,
            &quot;name&quot;: &quot;Ervin Howell&quot;,
            &quot;username&quot;: &quot;Antonette&quot;,
            &quot;email&quot;: &quot;Shanna@melissa.tv&quot;,
            &quot;website&quot;: &quot;anastasia.net&quot;,
            },
            {
            &quot;id&quot;: 3,
            &quot;name&quot;: &quot;Clementine Bauch&quot;,
            &quot;username&quot;: &quot;Samantha&quot;,
            &quot;email&quot;: &quot;Nathan@yesenia.net&quot;,
            &quot;website&quot;: &quot;ramiro.info&quot;,
            },
            {
            &quot;id&quot;: 4,
            &quot;name&quot;: &quot;Patricia Lebsack&quot;,
            &quot;username&quot;: &quot;Karianne&quot;,
            &quot;email&quot;: &quot;Julianne.OConner@kory.org&quot;,
            &quot;website&quot;: &quot;kale.biz&quot;,
            },
            {
            &quot;id&quot;: 5,
            &quot;name&quot;: &quot;Chelsey Dietrich&quot;,
            &quot;username&quot;: &quot;Kamren&quot;,
            &quot;email&quot;: &quot;Lucio_Hettinger@annie.ca&quot;,
            &quot;website&quot;: &quot;demarco.info&quot;,
            },
            {
            &quot;id&quot;: 6,
            &quot;name&quot;: &quot;Mrs. Dennis Schulist&quot;,
            &quot;username&quot;: &quot;Leopoldo_Corkery&quot;,
            &quot;email&quot;: &quot;Karley_Dach@jasper.info&quot;,
            &quot;website&quot;: &quot;ola.org&quot;,
            },
            {
            &quot;id&quot;: 7,
            &quot;name&quot;: &quot;Kurtis Weissnat&quot;,
            &quot;username&quot;: &quot;Elwyn.Skiles&quot;,
            &quot;email&quot;: &quot;Telly.Hoeger@billy.biz&quot;,
            &quot;website&quot;: &quot;elvis.io&quot;,
            },
            {
            &quot;id&quot;: 8,
            &quot;name&quot;: &quot;Nicholas Runolfsdottir V&quot;,
            &quot;username&quot;: &quot;Maxime_Nienow&quot;,
            &quot;email&quot;: &quot;Sherwood@rosamond.me&quot;,
            &quot;website&quot;: &quot;jacynthe.com&quot;,
            },
            {
            &quot;id&quot;: 9,
            &quot;name&quot;: &quot;Glenna Reichert&quot;,
            &quot;username&quot;: &quot;Delphine&quot;,
            &quot;email&quot;: &quot;Chaim_McDermott@dana.io&quot;,
            &quot;website&quot;: &quot;conrad.com&quot;,
            },
            {
            &quot;id&quot;: 10,
            &quot;name&quot;: &quot;Clementina DuBuque&quot;,
            &quot;username&quot;: &quot;Moriah.Stanton&quot;,
            &quot;email&quot;: &quot;Rey.Padberg@karina.biz&quot;,
            &quot;website&quot;: &quot;ambrose.net&quot;,
            }
            ]
            })
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "ExpandDatatable",
  data: () => ({
    title: "ExpandDatatable",
    users: [
      {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        website: "hildegard.org"
      },
      {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        email: "Shanna@melissa.tv",
        website: "anastasia.net"
      },
      {
        id: 3,
        name: "Clementine Bauch",
        username: "Samantha",
        email: "Nathan@yesenia.net",
        website: "ramiro.info"
      },
      {
        id: 4,
        name: "Patricia Lebsack",
        username: "Karianne",
        email: "Julianne.OConner@kory.org",
        website: "kale.biz"
      },
      {
        id: 5,
        name: "Chelsey Dietrich",
        username: "Kamren",
        email: "Lucio_Hettinger@annie.ca",
        website: "demarco.info"
      },
      {
        id: 6,
        name: "Mrs. Dennis Schulist",
        username: "Leopoldo_Corkery",
        email: "Karley_Dach@jasper.info",
        website: "ola.org"
      },
      {
        id: 7,
        name: "Kurtis Weissnat",
        username: "Elwyn.Skiles",
        email: "Telly.Hoeger@billy.biz",
        website: "elvis.io"
      },
      {
        id: 8,
        name: "Nicholas Runolfsdottir V",
        username: "Maxime_Nienow",
        email: "Sherwood@rosamond.me",
        website: "jacynthe.com"
      },
      {
        id: 9,
        name: "Glenna Reichert",
        username: "Delphine",
        email: "Chaim_McDermott@dana.io",
        website: "conrad.com"
      },
      {
        id: 10,
        name: "Clementina DuBuque",
        username: "Moriah.Stanton",
        email: "Rey.Padberg@karina.biz",
        website: "ambrose.net"
      }
    ],
    expandtable: false,
    expandable: []
  })
};
</script>