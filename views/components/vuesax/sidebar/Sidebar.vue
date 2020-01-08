<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
		/////////////////
		Default Sidebar
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Default Sidebar
          <vs-button class="ml-auto p-0" @click="defaultsidebar=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          One of the most common features is to have the hidden sidebar to show it when the user presses a button or makes an action, to add a sidebar we have the component
          <code>vs-sidebar</code>
        </p>

        <div>
          <vs-button @click="active=!active" color="primary" type="filled">Open Sidebar</vs-button>
          <vs-sidebar
            parent="body"
            default-index="1"
            color="primary"
            class="sidebarx"
            spacer
            v-model="active"
          >
            <div
              class="header-sidebar d-flex align-items-center justify-content-center"
              slot="header"
            >
              <div class="text-center">
                <vs-avatar size="70px" src="https://randomuser.me/api/portraits/men/85.jpg" />
                <div class="d-flex align-items-center">
                  <h4 class="mr-2">My Name</h4>
                  <vs-button color="primary" icon="more_horiz" type="flat"></vs-button>
                </div>
              </div>
            </div>

            <vs-sidebar-item index="1" icon="question_answer">Dashboard</vs-sidebar-item>

            <vs-sidebar-item index="2" icon="gavel">History</vs-sidebar-item>

            <vs-divider icon="person" position="left">User</vs-divider>

            <vs-sidebar-item index="3" icon="verified_user">Configurations</vs-sidebar-item>
            <vs-sidebar-item index="4" icon="account_box">Profile</vs-sidebar-item>
            <vs-sidebar-item index="5">Card</vs-sidebar-item>

            <div class="footer-sidebar" slot="footer">
              <vs-button icon="reply" color="danger" type="flat">log out</vs-button>
              <vs-button icon="settings" class="float-right" color="primary" type="border"></vs-button>
            </div>
          </vs-sidebar>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="defaultsidebar">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div id=&quot;parentx&quot;&gt;
            &lt;vs-button @click=&quot;active=!active&quot; color=&quot;primary&quot; type=&quot;filled&quot;&gt;Open Sidebar&lt;/vs-button&gt;
            &lt;vs-sidebar parent=&quot;body&quot; default-index=&quot;1&quot; color=&quot;primary&quot; class=&quot;sidebarx&quot; spacer v-model=&quot;active&quot;&gt;
            &lt;div class=&quot;header-sidebar&quot; slot=&quot;header&quot;&gt;
            &lt;vs-avatar size=&quot;70px&quot; src=&quot;https://randomuser.me/api/portraits/men/85.jpg&quot;/&gt;
            &lt;h4&gt;
            My Name
            &lt;vs-button color=&quot;primary&quot; icon=&quot;more_horiz&quot; type=&quot;flat&quot;&gt;&lt;/vs-button&gt;
            &lt;/h4&gt;
            &lt;/div&gt;
            &lt;vs-sidebar-item index=&quot;1&quot; icon=&quot;question_answer&quot;&gt;
            Dashboard
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2&quot; icon=&quot;gavel&quot;&gt;
            History
            &lt;/vs-sidebar-item&gt;
            &lt;vs-divider icon=&quot;person&quot; position=&quot;left&quot;&gt;
            User
            &lt;/vs-divider&gt;
            &lt;vs-sidebar-item index=&quot;3&quot; icon=&quot;verified_user&quot;&gt;
            Configurations
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;4&quot; icon=&quot;account_box&quot;&gt;
            Profile
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;5&quot; &gt;
            Card
            &lt;/vs-sidebar-item&gt;
            &lt;div class=&quot;footer-sidebar&quot; slot=&quot;footer&quot;&gt;
            &lt;vs-button icon=&quot;reply&quot; color=&quot;danger&quot; type=&quot;flat&quot;&gt;log out&lt;/vs-button&gt;
            &lt;vs-button icon=&quot;settings&quot; color=&quot;primary&quot; type=&quot;border&quot;&gt;&lt;/vs-button&gt;
            &lt;/div&gt;
            &lt;/vs-sidebar&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data:()=&gt;({
            active:false,
            })
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Parent Sidebar
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Parent Sidebar
          <vs-button class="ml-auto p-0" @click="parentsidebar=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can change the parent of the sidebar with the property
          <code>parent</code> that as a value requires an element of the DOM (#idx, .classx) or a reference of Vuejs as
          <code>$refs.myrefContent</code>
        </p>

        <div ref="parentSidebar" id="parentside">
          <vs-button @click="active1=!active1" color="primary" type="filled">Open Sidebar</vs-button>
          <vs-sidebar
            :parent="$refs.parentSidebar"
            default-index="1"
            color="primary"
            class="sidebarx"
            spacer
            v-model="active1"
          >
            <div
              class="header-sidebar d-flex align-items-center justify-content-center"
              slot="header"
            >
              <div class="text-center">
                <vs-avatar size="70px" src="https://randomuser.me/api/portraits/men/85.jpg" />
                <div class="d-flex align-items-center">
                  <h4 class="mr-2">My Name</h4>
                  <vs-button color="primary" icon="more_horiz" type="flat"></vs-button>
                </div>
              </div>
            </div>

            <vs-sidebar-item index="1" icon="question_answer">Dashboard</vs-sidebar-item>

            <vs-sidebar-item index="2" icon="gavel">History</vs-sidebar-item>

            <vs-divider icon="person" position="left">User</vs-divider>

            <vs-sidebar-item index="3" icon="verified_user">Configurations</vs-sidebar-item>
            <vs-sidebar-item index="4" icon="account_box">Profile</vs-sidebar-item>
            <vs-sidebar-item index="5">Card</vs-sidebar-item>

            <div class="footer-sidebar" slot="footer">
              <vs-button icon="reply" color="danger" type="flat">log out</vs-button>
              <vs-button icon="settings" color="primary" type="border"></vs-button>
            </div>
          </vs-sidebar>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="parentsidebar">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div ref=&quot;parentSidebar&quot; id=&quot;parentx&quot;&gt;
            &lt;vs-button @click=&quot;active=!active&quot; color=&quot;primary&quot; type=&quot;filled&quot;&gt;Open Sidebar&lt;/vs-button&gt;
            &lt;vs-sidebar :parent=&quot;$refs.parentSidebar&quot; default-index=&quot;1&quot; color=&quot;primary&quot; class=&quot;sidebarx&quot; spacer v-model=&quot;active&quot;&gt;
            &lt;div class=&quot;header-sidebar&quot; slot=&quot;header&quot;&gt;
            &lt;vs-avatar size=&quot;70px&quot; src=&quot;https://randomuser.me/api/portraits/men/85.jpg&quot;/&gt;
            &lt;h4&gt;
            My Name
            &lt;vs-button color=&quot;primary&quot; icon=&quot;more_horiz&quot; type=&quot;flat&quot;&gt;&lt;/vs-button&gt;
            &lt;/h4&gt;
            &lt;/div&gt;
            &lt;vs-sidebar-item index=&quot;1&quot; icon=&quot;question_answer&quot;&gt;
            Dashboard
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2&quot; icon=&quot;gavel&quot;&gt;
            History
            &lt;/vs-sidebar-item&gt;
            &lt;vs-divider icon=&quot;person&quot; position=&quot;left&quot;&gt;
            User
            &lt;/vs-divider&gt;
            &lt;vs-sidebar-item index=&quot;3&quot; icon=&quot;verified_user&quot;&gt;
            Configurations
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;4&quot; icon=&quot;account_box&quot;&gt;
            Profile
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;5&quot; &gt;
            Card
            &lt;/vs-sidebar-item&gt;
            &lt;div class=&quot;footer-sidebar&quot; slot=&quot;footer&quot;&gt;
            &lt;vs-button icon=&quot;reply&quot; color=&quot;danger&quot; type=&quot;flat&quot;&gt;log out&lt;/vs-button&gt;
            &lt;vs-button icon=&quot;settings&quot; color=&quot;primary&quot; type=&quot;border&quot;&gt;&lt;/vs-button&gt;
            &lt;/div&gt;
            &lt;/vs-sidebar&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data:()=&gt;({
            active:false,
            })
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Static Sidebar
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Static Sidebar
          <vs-button class="ml-auto p-0" @click="staticsidebar=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can also use the sidebar in static mode with the property
          <code>static</code>
        </p>

        <div class="parentx-static">
          <vs-sidebar static-position default-index="1" color="primary" spacer v-model="active2">
            <div
              class="header-sidebar d-flex align-items-center justify-content-center"
              slot="header"
            >
              <div class="text-center">
                <vs-avatar size="70px" src="https://randomuser.me/api/portraits/men/85.jpg" />
                <div class="d-flex align-items-center">
                  <h4 class="mr-2">My Name</h4>
                  <vs-button color="primary" icon="more_horiz" type="flat"></vs-button>
                </div>
              </div>
            </div>

            <vs-sidebar-item index="1" icon="question_answer">Dashboard</vs-sidebar-item>

            <vs-sidebar-item index="2" icon="gavel">History</vs-sidebar-item>

            <vs-divider icon="person" position="left">User</vs-divider>

            <vs-sidebar-item index="3" icon="verified_user">Configurations</vs-sidebar-item>
            <vs-sidebar-item index="4" icon="account_box">Profile</vs-sidebar-item>
            <vs-sidebar-item index="5">Card</vs-sidebar-item>

            <div class="footer-sidebar" slot="footer">
              <vs-button icon="reply" color="danger" type="flat">log out</vs-button>
              <vs-button icon="settings" color="primary" type="border"></vs-button>
            </div>
          </vs-sidebar>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="staticsidebar">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;parentx-static&quot;&gt;
            &lt;vs-sidebar static-position default-index=&quot;1&quot; color=&quot;primary&quot; class=&quot;sidebarx&quot; spacer v-model=&quot;active&quot;&gt;
            &lt;div class=&quot;header-sidebar&quot; slot=&quot;header&quot;&gt;
            &lt;vs-avatar size=&quot;70px&quot; src=&quot;https://randomuser.me/api/portraits/men/85.jpg&quot;/&gt;
            &lt;h4&gt;
            My Name
            &lt;vs-button color=&quot;primary&quot; icon=&quot;more_horiz&quot; type=&quot;flat&quot;&gt;&lt;/vs-button&gt;
            &lt;/h4&gt;
            &lt;/div&gt;
            &lt;vs-sidebar-item index=&quot;1&quot; icon=&quot;question_answer&quot;&gt;
            Dashboard
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2&quot; icon=&quot;gavel&quot;&gt;
            History
            &lt;/vs-sidebar-item&gt;
            &lt;vs-divider icon=&quot;person&quot; position=&quot;left&quot;&gt;
            User
            &lt;/vs-divider&gt;
            &lt;vs-sidebar-item index=&quot;3&quot; icon=&quot;verified_user&quot;&gt;
            Configurations
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;4&quot; icon=&quot;account_box&quot;&gt;
            Profile
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;5&quot; &gt;
            Card
            &lt;/vs-sidebar-item&gt;
            &lt;div class=&quot;footer-sidebar&quot; slot=&quot;footer&quot;&gt;
            &lt;vs-button icon=&quot;reply&quot; color=&quot;danger&quot; type=&quot;flat&quot;&gt;log out&lt;/vs-button&gt;
            &lt;vs-button icon=&quot;settings&quot; color=&quot;primary&quot; type=&quot;border&quot;&gt;&lt;/vs-button&gt;
            &lt;/div&gt;
            &lt;/vs-sidebar&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data:()=&gt;({
            active:false,
            })
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Group Collapsed Sidebar
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Group Collapsed Sidebar
          <vs-button class="ml-auto p-0" @click="groupsidebar=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can have groups of sub menus with the component
          <code>vs-slider-group</code> that as a required parameter we have the
          <code>title</code>, you can add as many groups as you need, including internally from the same component.
        </p>

        <div id="parentx">
          <vs-button @click="active3=!active3" color="primary" type="filled">Open Sidebar</vs-button>
          <vs-sidebar
            parent="body"
            default-index="1"
            color="primary"
            class="sidebarx"
            spacer
            v-model="active3"
          >
            <div
              class="header-sidebar d-flex align-items-center justify-content-center"
              slot="header"
            >
              <div class="text-center">
                <vs-avatar size="70px" src="https://randomuser.me/api/portraits/men/85.jpg" />
                <div class="d-flex align-items-center">
                  <h4 class="mr-2">My Name</h4>
                  <vs-button color="primary" icon="more_horiz" type="flat"></vs-button>
                </div>
              </div>
            </div>
            <vs-sidebar-group title="Aplication">
              <vs-sidebar-item index="1" icon="question_answer">Dashboard</vs-sidebar-item>
              <vs-sidebar-group title="Store">
                <vs-sidebar-item index="2.1" icon="store">Store</vs-sidebar-item>
                <vs-sidebar-item index="2.2" icon="nature_people">Nature</vs-sidebar-item>
                <vs-sidebar-item index="2.3" icon="style">Style</vs-sidebar-item>
              </vs-sidebar-group>
              <vs-sidebar-item index="2" icon="gavel">History</vs-sidebar-item>
              <vs-sidebar-item index="3" icon="https">security</vs-sidebar-item>
              <vs-sidebar-item index="4" icon="help">Help</vs-sidebar-item>
            </vs-sidebar-group>

            <vs-divider icon="person" position="left">User</vs-divider>

            <vs-sidebar-item index="5" icon="verified_user">Configurations</vs-sidebar-item>
            <vs-sidebar-item index="6" icon="account_box">Profile</vs-sidebar-item>

            <div class="footer-sidebar" slot="footer">
              <vs-button icon="reply" color="danger" type="flat">log out</vs-button>
              <vs-button icon="settings" color="primary" type="border"></vs-button>
            </div>
          </vs-sidebar>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="groupsidebar">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div id=&quot;parentx&quot;&gt;
            &lt;vs-button @click=&quot;active=!active&quot; color=&quot;primary&quot; type=&quot;filled&quot;&gt;Open Sidebar&lt;/vs-button&gt;
            &lt;vs-sidebar parent=&quot;body&quot; default-index=&quot;1&quot; color=&quot;primary&quot; class=&quot;sidebarx&quot; spacer v-model=&quot;active&quot;&gt;
            &lt;div class=&quot;header-sidebar&quot; slot=&quot;header&quot;&gt;
            &lt;vs-avatar size=&quot;70px&quot; src=&quot;https://randomuser.me/api/portraits/men/85.jpg&quot;/&gt;
            &lt;h4&gt;
            My Name
            &lt;vs-button color=&quot;primary&quot; icon=&quot;more_horiz&quot; type=&quot;flat&quot;&gt;&lt;/vs-button&gt;
            &lt;/h4&gt;
            &lt;/div&gt;
            &lt;vs-sidebar-group title=&quot;Aplication&quot;&gt;
            &lt;vs-sidebar-item index=&quot;1&quot; icon=&quot;question_answer&quot;&gt;
            Dashboard
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-group title=&quot;Store&quot;&gt;
            &lt;vs-sidebar-item index=&quot;2.1&quot; icon=&quot;store&quot;&gt;
            Store
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2.2&quot; icon=&quot;nature_people&quot;&gt;
            Nature
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2.3&quot; icon=&quot;style&quot;&gt;
            Style
            &lt;/vs-sidebar-item&gt;
            &lt;/vs-sidebar-group&gt;
            &lt;vs-sidebar-item index=&quot;2&quot; icon=&quot;gavel&quot;&gt;
            History
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;3&quot; icon=&quot;https&quot;&gt;
            security
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;4&quot; icon=&quot;help&quot;&gt;
            Help
            &lt;/vs-sidebar-item&gt;
            &lt;/vs-sidebar-group&gt;
            &lt;vs-divider icon=&quot;person&quot; position=&quot;left&quot;&gt;
            User
            &lt;/vs-divider&gt;
            &lt;vs-sidebar-item index=&quot;5&quot; icon=&quot;verified_user&quot;&gt;
            Configurations
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;6&quot; icon=&quot;account_box&quot;&gt;
            Profile
            &lt;/vs-sidebar-item&gt;
            &lt;div class=&quot;footer-sidebar&quot; slot=&quot;footer&quot;&gt;
            &lt;vs-button icon=&quot;reply&quot; color=&quot;danger&quot; type=&quot;flat&quot;&gt;log out&lt;/vs-button&gt;
            &lt;vs-button icon=&quot;settings&quot; color=&quot;primary&quot; type=&quot;border&quot;&gt;&lt;/vs-button&gt;
            &lt;/div&gt;
            &lt;/vs-sidebar&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data:()=&gt;({
            active:false,
            })
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Open Right Sidebar
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Open Right Sidebar
          <vs-button class="ml-auto p-0" @click="rightsidebar=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p
          class="card-subtitle"
        >You can also choose where you'd like the sidebar to appear, right or left? By default, a sidebar will be located on the left of the screen but sometimes, a right-screened sidebar is really useful!</p>

        <div id="parentx">
          <vs-button @click="active4=!active4" color="primary" type="filled">Open Sidebar</vs-button>
          <vs-sidebar
            position-right
            parent="body"
            default-index="1"
            color="primary"
            class="sidebarx"
            spacer
            v-model="active4"
          >
            <div
              class="header-sidebar d-flex align-items-center justify-content-center"
              slot="header"
            >
              <div class="text-center">
                <vs-avatar size="70px" src="https://randomuser.me/api/portraits/men/85.jpg" />
                <div class="d-flex align-items-center">
                  <h4 class="mr-2">My Name</h4>
                  <vs-button color="primary" icon="more_horiz" type="flat"></vs-button>
                </div>
              </div>
            </div>

            <vs-sidebar-item index="1" icon="question_answer">Dashboard</vs-sidebar-item>

            <vs-sidebar-item index="2" icon="gavel">History</vs-sidebar-item>

            <vs-divider icon="person" position="left">User</vs-divider>

            <vs-sidebar-item index="3" icon="verified_user">Configurations</vs-sidebar-item>
            <vs-sidebar-item index="4" icon="account_box">Profile</vs-sidebar-item>
            <vs-sidebar-item index="5">Card</vs-sidebar-item>

            <div class="footer-sidebar" slot="footer">
              <vs-button icon="reply" color="danger" type="flat">log out</vs-button>
              <vs-button icon="settings" class="float-right" color="primary" type="border"></vs-button>
            </div>
          </vs-sidebar>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="rightsidebar">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div id=&quot;parentx&quot;&gt;
            &lt;vs-button @click=&quot;active=!active&quot; color=&quot;primary&quot; type=&quot;filled&quot;&gt;Open Sidebar&lt;/vs-button&gt;
            &lt;vs-sidebar position-right parent=&quot;body&quot; default-index=&quot;1&quot; color=&quot;primary&quot; class=&quot;sidebarx&quot; spacer v-model=&quot;active&quot;&gt;
            &lt;div class=&quot;header-sidebar&quot; slot=&quot;header&quot;&gt;
            &lt;vs-avatar size=&quot;70px&quot; src=&quot;https://randomuser.me/api/portraits/men/85.jpg&quot;/&gt;
            &lt;h4&gt;
            My Name
            &lt;vs-button color=&quot;primary&quot; icon=&quot;more_horiz&quot; type=&quot;flat&quot;&gt;&lt;/vs-button&gt;
            &lt;/h4&gt;
            &lt;/div&gt;
            &lt;vs-sidebar-item index=&quot;1&quot; icon=&quot;question_answer&quot;&gt;
            Dashboard
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2&quot; icon=&quot;gavel&quot;&gt;
            History
            &lt;/vs-sidebar-item&gt;
            &lt;vs-divider icon=&quot;person&quot; position=&quot;left&quot;&gt;
            User
            &lt;/vs-divider&gt;
            &lt;vs-sidebar-item index=&quot;3&quot; icon=&quot;verified_user&quot;&gt;
            Configurations
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;4&quot; icon=&quot;account_box&quot;&gt;
            Profile
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;5&quot; &gt;
            Card
            &lt;/vs-sidebar-item&gt;
            &lt;div class=&quot;footer-sidebar&quot; slot=&quot;footer&quot;&gt;
            &lt;vs-button icon=&quot;reply&quot; color=&quot;danger&quot; type=&quot;flat&quot;&gt;log out&lt;/vs-button&gt;
            &lt;vs-button icon=&quot;settings&quot; color=&quot;primary&quot; type=&quot;border&quot;&gt;&lt;/vs-button&gt;
            &lt;/div&gt;
            &lt;/vs-sidebar&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data:()=&gt;({
            active:false,
            })
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Reduce and Expand Sidebar
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Reduce and Expand Sidebar
          <vs-button class="ml-auto p-0" @click="expandsidebar=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can have a reduced sidebar with the
          <code>reduce</code> property which by default makes the sidebar look reduced and when hover expands, if you do not want the functionality to expand when hovering you can remove it with the
          <code>reduce-not-hover-expand</code> property
        </p>

        <div id="parentx">
          <div class="btn-alignment">
            <vs-button
              @click="active5=!active5, notExpand = false"
              color="primary"
              type="filled"
            >Open Sidebar Reduce-expand</vs-button>
            <vs-button
              @click="active5=!active5, notExpand = true"
              color="primary"
              type="filled"
            >Open Sidebar Reduce-only</vs-button>
          </div>
          <vs-sidebar
            :reduce="reduce"
            :reduce-not-hover-expand="notExpand"
            parent="body"
            default-index="1"
            color="primary"
            class="sidebarx"
            spacer
            v-model="active5"
          >
            <div class="header-sidebar" slot="header">
              <vs-avatar size="70px" src="https://randomuser.me/api/portraits/men/85.jpg" />
            </div>
            <vs-sidebar-group open title="Application">
              <vs-sidebar-item index="1" icon="menu" @click="reduce=!reduce">
                <span class="hide-in-minisidebar">Toggle Sidebar</span>
              </vs-sidebar-item>
              <vs-sidebar-item index="5" icon="verified_user">
                <span class="hide-in-minisidebar">Configurations</span>
              </vs-sidebar-item>
              <vs-sidebar-group title="Store">
                <vs-sidebar-item index="2.1" icon="store">
                  <span class="hide-in-minisidebar">Store</span>
                </vs-sidebar-item>
                <vs-sidebar-item index="2.2" icon="nature_people">
                  <span class="hide-in-minisidebar">Nature</span>
                </vs-sidebar-item>
                <vs-sidebar-item index="2.3" icon="style">
                  <span class="hide-in-minisidebar">Style</span>
                </vs-sidebar-item>
              </vs-sidebar-group>
              <vs-sidebar-item index="2" icon="gavel">
                <span class="hide-in-minisidebar">History</span>
              </vs-sidebar-item>
              <vs-sidebar-item index="3" icon="https">
                <span class="hide-in-minisidebar">Security</span>
              </vs-sidebar-item>
              <vs-sidebar-item index="4" icon="help">
                <span class="hide-in-minisidebar">Help</span>
              </vs-sidebar-item>
            </vs-sidebar-group>

            <vs-divider icon="person" position="left">User</vs-divider>

            <vs-sidebar-item index="6" icon="account_box">Profile</vs-sidebar-item>

            <div class="footer-sidebar" slot="footer">
              <vs-button icon="settings" color="primary" type="border"></vs-button>
            </div>
          </vs-sidebar>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="expandsidebar">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div id=&quot;parentx&quot;&gt;
            &lt;vs-button @click=&quot;active=!active, notExpand = false&quot; color=&quot;success&quot; type=&quot;filled&quot;&gt;Open Sidebar Reduce-expand&lt;/vs-button&gt;
            &lt;vs-button @click=&quot;active=!active, notExpand = true&quot; color=&quot;success&quot; type=&quot;filled&quot;&gt;Open Sidebar Reduce-only&lt;/vs-button&gt;
            &lt;vs-sidebar :reduce=&quot;reduce&quot; :reduce-not-hover-expand=&quot;notExpand&quot; parent=&quot;body&quot; default-index=&quot;1&quot; color=&quot;success&quot; class=&quot;sidebarx&quot; spacer v-model=&quot;active&quot;&gt;
            &lt;div class=&quot;header-sidebar&quot; slot=&quot;header&quot;&gt;
            &lt;vs-avatar size=&quot;70px&quot; src=&quot;https://randomuser.me/api/portraits/men/85.jpg&quot;/&gt;
            &lt;/div&gt;
            &lt;vs-sidebar-group open title=&quot;Application&quot;&gt;
            &lt;vs-sidebar-item index=&quot;1&quot; icon=&quot;menu&quot; @click=&quot;reduce=!reduce&quot;&gt;
            Toggle Sidebar
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;5&quot; icon=&quot;verified_user&quot;&gt;
            Configurations
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-group title=&quot;Store&quot;&gt;
            &lt;vs-sidebar-item index=&quot;2.1&quot; icon=&quot;store&quot;&gt;
            Store
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2.2&quot; icon=&quot;nature_people&quot;&gt;
            Nature
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;2.3&quot; icon=&quot;style&quot;&gt;
            Style
            &lt;/vs-sidebar-item&gt;
            &lt;/vs-sidebar-group&gt;
            &lt;vs-sidebar-item index=&quot;2&quot; icon=&quot;gavel&quot;&gt;
            History
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;3&quot; icon=&quot;https&quot;&gt;
            Security
            &lt;/vs-sidebar-item&gt;
            &lt;vs-sidebar-item index=&quot;4&quot; icon=&quot;help&quot;&gt;
            Help
            &lt;/vs-sidebar-item&gt;
            &lt;/vs-sidebar-group&gt;
            &lt;vs-divider icon=&quot;person&quot; position=&quot;left&quot;&gt;
            User
            &lt;/vs-divider&gt;
            &lt;vs-sidebar-item index=&quot;6&quot; icon=&quot;account_box&quot;&gt;
            Profile
            &lt;/vs-sidebar-item&gt;
            &lt;div class=&quot;footer-sidebar&quot; slot=&quot;footer&quot;&gt;
            &lt;vs-button icon=&quot;settings&quot; color=&quot;primary&quot; type=&quot;border&quot;&gt;&lt;/vs-button&gt;
            &lt;/div&gt;
            &lt;/vs-sidebar&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data:()=&gt;({
            active:false,
            notExpand: false,
            reduce: true
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
  name: "sidebar",
  data: () => ({
    title: "Sidebar",
    defaultsidebar: false,
    active: false,
    parentsidebar: false,
    active1: false,
    staticsidebar: false,
    active2: false,
    groupsidebar: false,
    active3: false,
    rightsidebar: false,
    active4: false,
    expandsidebar: false,
    active5: false,
    notExpand: false,
    reduce: true
  })
};
</script>

<style lang="scss">
#parentside {
  overflow: hidden;
  height: 500px;
  position: relative;
}
</style>

