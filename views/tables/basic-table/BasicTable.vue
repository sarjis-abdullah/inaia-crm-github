<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
		/////////////////
		Basic Table
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Basic Table
          <vs-button class="ml-auto p-0" @click="basictable=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>

        <div class="table-responsive">
          <table class="table v-middle border">
            <thead>
              <tr class>
                <th class="border-top-0">Products</th>
                <th class="border-top-0">License</th>
                <th class="border-top-0">Support Agent</th>
                <th class="border-top-0">Technology</th>
                <th class="border-top-0">Tickets</th>
                <th class="border-top-0">Sales</th>
                <th class="border-top-0">Earnings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="mr-2">
                      <vs-avatar color="primary" text="Erimary" />
                    </div>
                    <div class>
                      <h5 class="m-b-0">Elite Admin</h5>
                    </div>
                  </div>
                </td>
                <td>Single Use</td>
                <td>John Doe</td>
                <td>
                  <label class="label label-danger">Angular</label>
                </td>
                <td>46</td>
                <td>356</td>
                <td>
                  <h5 class="m-b-0">$2850.06</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="mr-2">
                      <vs-avatar color="danger" text="Mrimary" />
                    </div>
                    <div class>
                      <h5 class="m-b-0">Monster Admin</h5>
                    </div>
                  </div>
                </td>
                <td>Single Use</td>
                <td>Venessa Fern</td>
                <td>
                  <label class="label label-info">Vue Js</label>
                </td>
                <td>46</td>
                <td>356</td>
                <td>
                  <h5 class="m-b-0">$2850.06</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="mr-2">
                      <vs-avatar color="warning" text="Primary" />
                    </div>
                    <div class>
                      <h5 class="m-b-0">Material Pro Admin</h5>
                    </div>
                  </div>
                </td>
                <td>Single Use</td>
                <td>John Doe</td>
                <td>
                  <label class="label label-success">Bootstrap</label>
                </td>
                <td>46</td>
                <td>356</td>
                <td>
                  <h5 class="m-b-0">$2850.06</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="mr-2">
                      <vs-avatar color="success" text="Arimary" />
                    </div>
                    <div class>
                      <h5 class="m-b-0">Ample Admin</h5>
                    </div>
                  </div>
                </td>
                <td>Single Use</td>
                <td>John Doe</td>
                <td>
                  <label class="label label-purple">React</label>
                </td>
                <td>46</td>
                <td>356</td>
                <td>
                  <h5 class="m-b-0">$2850.06</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="basictable">
          <vs-prism>
            &lt;div class=&quot;table-responsive&quot;&gt;
            &lt;table class=&quot;table v-middle border&quot;&gt;
            &lt;thead&gt;
            &lt;tr class&gt;
            &lt;th class=&quot;border-top-0&quot;&gt;Products&lt;/th&gt;
            &lt;th class=&quot;border-top-0&quot;&gt;License&lt;/th&gt;
            &lt;th class=&quot;border-top-0&quot;&gt;Support Agent&lt;/th&gt;
            &lt;th class=&quot;border-top-0&quot;&gt;Technology&lt;/th&gt;
            &lt;th class=&quot;border-top-0&quot;&gt;Tickets&lt;/th&gt;
            &lt;th class=&quot;border-top-0&quot;&gt;Sales&lt;/th&gt;
            &lt;th class=&quot;border-top-0&quot;&gt;Earnings&lt;/th&gt;
            &lt;/tr&gt;
            &lt;/thead&gt;
            &lt;tbody&gt;
            &lt;tr&gt;
            &lt;td&gt;
            &lt;div class=&quot;d-flex align-items-center&quot;&gt;
            &lt;div class=&quot;mr-2&quot;&gt;
            &lt;vs-avatar color=&quot;primary&quot; text=&quot;Erimary&quot; /&gt;
            &lt;/div&gt;
            &lt;div class&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;Elite Admin&lt;/h5&gt;
            &lt;/div&gt;
            &lt;/div&gt;
            &lt;/td&gt;
            &lt;td&gt;Single Use&lt;/td&gt;
            &lt;td&gt;John Doe&lt;/td&gt;
            &lt;td&gt;
            &lt;label class=&quot;label label-danger&quot;&gt;Angular&lt;/label&gt;
            &lt;/td&gt;
            &lt;td&gt;46&lt;/td&gt;
            &lt;td&gt;356&lt;/td&gt;
            &lt;td&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;$2850.06&lt;/h5&gt;
            &lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
            &lt;td&gt;
            &lt;div class=&quot;d-flex align-items-center&quot;&gt;
            &lt;div class=&quot;mr-2&quot;&gt;
            &lt;vs-avatar color=&quot;danger&quot; text=&quot;Mrimary&quot; /&gt;
            &lt;/div&gt;
            &lt;div class&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;Monster Admin&lt;/h5&gt;
            &lt;/div&gt;
            &lt;/div&gt;
            &lt;/td&gt;
            &lt;td&gt;Single Use&lt;/td&gt;
            &lt;td&gt;Venessa Fern&lt;/td&gt;
            &lt;td&gt;
            &lt;label class=&quot;label label-info&quot;&gt;Vue Js&lt;/label&gt;
            &lt;/td&gt;
            &lt;td&gt;46&lt;/td&gt;
            &lt;td&gt;356&lt;/td&gt;
            &lt;td&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;$2850.06&lt;/h5&gt;
            &lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
            &lt;td&gt;
            &lt;div class=&quot;d-flex align-items-center&quot;&gt;
            &lt;div class=&quot;mr-2&quot;&gt;
            &lt;vs-avatar color=&quot;warning&quot; text=&quot;Primary&quot; /&gt;
            &lt;/div&gt;
            &lt;div class&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;Material Pro Admin&lt;/h5&gt;
            &lt;/div&gt;
            &lt;/div&gt;
            &lt;/td&gt;
            &lt;td&gt;Single Use&lt;/td&gt;
            &lt;td&gt;John Doe&lt;/td&gt;
            &lt;td&gt;
            &lt;label class=&quot;label label-success&quot;&gt;Bootstrap&lt;/label&gt;
            &lt;/td&gt;
            &lt;td&gt;46&lt;/td&gt;
            &lt;td&gt;356&lt;/td&gt;
            &lt;td&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;$2850.06&lt;/h5&gt;
            &lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
            &lt;td&gt;
            &lt;div class=&quot;d-flex align-items-center&quot;&gt;
            &lt;div class=&quot;mr-2&quot;&gt;
            &lt;vs-avatar color=&quot;success&quot; text=&quot;Arimary&quot; /&gt;
            &lt;/div&gt;
            &lt;div class&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;Ample Admin&lt;/h5&gt;
            &lt;/div&gt;
            &lt;/div&gt;
            &lt;/td&gt;
            &lt;td&gt;Single Use&lt;/td&gt;
            &lt;td&gt;John Doe&lt;/td&gt;
            &lt;td&gt;
            &lt;label class=&quot;label label-purple&quot;&gt;React&lt;/label&gt;
            &lt;/td&gt;
            &lt;td&gt;46&lt;/td&gt;
            &lt;td&gt;356&lt;/td&gt;
            &lt;td&gt;
            &lt;h5 class=&quot;m-b-0&quot;&gt;$2850.06&lt;/h5&gt;
            &lt;/td&gt;
            &lt;/tr&gt;
            &lt;/tbody&gt;
            &lt;/table&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
		/////////////////
		Default Table
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Default Table
          <vs-button class="ml-auto p-0" @click="defaulttable=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          To implement a data table we have the component
          <code>vs-table</code>, also sub components and slots for a better management of the structure and operation
        </p>

        <ul class="list-group list-group-horizontal-lg con-s">
          <li class="list-group-item rounded-0 py-2">vs-th: Component</li>
          <li class="list-group-item rounded-0 py-2">vs-tr: Component</li>
          <li class="list-group-item rounded-0 py-2">vs-td: Component</li>
          <li class="list-group-item rounded-0 py-2">thead: Slot</li>
          <li class="list-group-item rounded-0 py-2">tbody: Slot</li>
          <li class="list-group-item rounded-0 py-2">header: Slot</li>
        </ul>

        <div class="border mt-3">
          <vs-table :data="users">
            <template slot="thead">
              <vs-th>Email</vs-th>
              <vs-th>Name</vs-th>
              <vs-th>Website</vs-th>
              <vs-th>Nro</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>

                <vs-td :data="data[indextr].username">{{data[indextr].name}}</vs-td>

                <vs-td :data="data[indextr].id">{{data[indextr].id}}</vs-td>

                <vs-td :data="data[indextr].id">{{data[indextr].website}}</vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="defaulttable">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div&gt;
            &lt;vs-table :data=&quot;users&quot;&gt;
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
            &lt;vs-tr :key=&quot;indextr&quot; v-for=&quot;(tr, indextr) in data&quot; &gt;
            &lt;vs-td :data=&quot;data[indextr].email&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].username&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].id&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].id&quot;&gt;
            &lt;/vs-td&gt;
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

      <!--
        /////////////////
        Striped Table
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Striped Table
          <vs-button class="ml-auto p-0" @click="stripedtable=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can have a sebra effect by adding the property
          <code>striped</code>
        </p>

        <div class="border">
          <vs-table stripe :data="users">
            <template slot="thead">
              <vs-th>Email</vs-th>
              <vs-th>Name</vs-th>
              <vs-th>Website</vs-th>
              <vs-th>Nro</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>

                <vs-td :data="data[indextr].username">{{data[indextr].name}}</vs-td>

                <vs-td :data="data[indextr].id">{{data[indextr].id}}</vs-td>

                <vs-td :data="data[indextr].id">{{data[indextr].website}}</vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="stripedtable">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div&gt;
            &lt;vs-table stripe :data=&quot;users&quot;&gt;
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
            &lt;vs-tr :key=&quot;indextr&quot; v-for=&quot;(tr, indextr) in data&quot; &gt;
            &lt;vs-td :data=&quot;data[indextr].email&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].username&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].id&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].id&quot;&gt;
            &lt;/vs-td&gt;
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

      <!--
        /////////////////
        State Table
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          State Table
          <vs-button class="ml-auto p-0" @click="statetable=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          There are times when we need to add a state to our tr in the table so we have the property state inside the component
          <code>vs-tr</code>
        </p>

        <div class="border">
          <vs-table :data="users">
            <template slot="thead">
              <vs-th>Email</vs-th>
              <vs-th>Name</vs-th>
              <vs-th>website</vs-th>
              <vs-th>Nro</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr
                :state="indextr == 2 || indextr == 5?'success':indextr == 6?'danger':null"
                :key="indextr"
                v-for="(tr, indextr) in data"
              >
                <vs-td :data="data[indextr].email">{{data[indextr].email}}</vs-td>

                <vs-td :data="data[indextr].username">{{data[indextr].username}}</vs-td>

                <vs-td :data="data[indextr].id">{{data[indextr].website}}</vs-td>

                <vs-td :data="data[indextr].id">{{data[indextr].id}}</vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="statetable">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div&gt;
            &lt;vs-table :data=&quot;users&quot;&gt;
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
            website
            &lt;/vs-th&gt;
            &lt;vs-th&gt;
            Nro
            &lt;/vs-th&gt;
            &lt;/template&gt;
            &lt;template slot-scope=&quot;{data}&quot;&gt;
            &lt;vs-tr :state=&quot;indextr == 2 || indextr == 5?'success':indextr == 6?'danger':null&quot; :key=&quot;indextr&quot; v-for=&quot;(tr, indextr) in data&quot; &gt;
            &lt;vs-td :data=&quot;data[indextr].email&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].username&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].id&quot;&gt;
            &lt;/vs-td&gt;
            &lt;vs-td :data=&quot;data[indextr].id&quot;&gt;
            &lt;/vs-td&gt;
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
  name: "basictable",
  data: () => ({
    title: "BasicTable",
    basictable: false,
    defaulttable: false,
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
    stripedtable: false,
    statetable: false
  })
};
</script>