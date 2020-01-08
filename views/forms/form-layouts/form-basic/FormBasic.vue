<template>
  <vs-row>
    <!-- ////////// 
          Card 1 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">General Form</h3>
          <h5
            class="card-subtitle font-weight-normal text-muted mb-0"
          >All with vuesax element attributes</h5>
        </div>

        <div>
          <vs-input
            type="email"
            label="Email address"
            class="w-100"
            placeholder="Enter Email"
            v-model="email1"
            description-text="We'll never share your email with anyone else."
          />
          <vs-input
            type="password"
            label="Password"
            class="w-100 mt-4"
            placeholder="Enter Password"
            v-model="password1"
          />
          <div class="d-flex align-items-center mt-4">
            <vs-checkbox v-model="checkBox1">Check Me Out !</vs-checkbox>
          </div>
          <vs-button color="primary" type="filled" class="mt-4">Submit</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 2 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Default Form</h3>
          <h5
            class="card-subtitle font-weight-normal text-muted mb-0"
          >All with vuesax element attributes</h5>
        </div>

        <div>
          <vs-input label="Default Text e.g. 'George deo'" class="w-100" v-model="name2" />
          <vs-input
            type="email"
            label="Email e.g. 'example@gmail.com'"
            class="w-100 mt-4"
            placeholder="Enter Email"
            v-model="email2"
          />
          <vs-input
            type="password"
            label="Password"
            class="w-100 mt-4"
            placeholder="Enter Password"
            v-model="password2"
          />
          <vs-input
            label="Placeholder"
            class="w-100 mt-4"
            placeholder="Enter Placeholder"
            v-model="placeholder2"
          />
          <vs-textarea label="Textarea" class="w-100 mt-4" v-model="textarea2" />
          <vs-input
            label="Disabled input"
            class="w-100 mt-4"
            placeholder="Disabled input"
            v-model="dinput2"
            disabled="true"
          />
          <vs-row class="mt-4">
            <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
              <div class="d-flex align-items-center">
                <div>
                  <vs-checkbox v-model="custom2" class="mb-2">Check this custom checkbox</vs-checkbox>
                  <vs-checkbox v-model="custom2_1" class="mb-2">Check this custom checkbox</vs-checkbox>
                  <vs-checkbox v-model="custom2_2" class="mb-2">Check this custom checkbox</vs-checkbox>
                </div>
              </div>
            </vs-col>
            <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
              <div class="d-flex align-items-center mt-4 mt-md-0">
                <div>
                  <vs-radio
                    v-model="radio2"
                    vs-name="radio2"
                    vs-value="val1"
                  >Toggle this custom radio</vs-radio>
                  <vs-radio
                    v-model="radio2"
                    vs-name="radio2"
                    vs-value="val2"
                  >Toggle this custom radio</vs-radio>
                </div>
              </div>
            </vs-col>
          </vs-row>
          <div class="mt-4">
            <div class="d-flex align-items-center mb-2">
              <vs-switch v-model="switch2">
                <span slot="on">On</span>
                <span slot="off">Off</span>
              </vs-switch>
              <label class="mb-0 ml-2">Toggle this switch element</label>
            </div>
            <div class="d-flex align-items-center">
              <vs-switch v-model="switch2_1" disabled="true">
                <span slot="on">On</span>
                <span slot="off">Off</span>
              </vs-switch>
              <label class="mb-0 ml-2">Disabled switch element</label>
            </div>
          </div>
          <vs-select class="w-100 mt-4" label="Input Select" v-model="select2">
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in options2"
            />
          </vs-select>
          <vs-input
            class="w-100 mt-4"
            label="Helping text"
            description-text="A block of help text that breaks onto a new line and may extend beyond one line."
            placeholder="Helping text"
            v-model="help2"
          />
          <div class="btn-alignment mt-4">
            <vs-button color="success" type="filled">Submit</vs-button>
          </div>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 3 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title mb-0">Other Sample Form</h3>
        </div>

        <h4 class>Peronal Info</h4>
        <hr class="custom-hr" />
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-input
              label="First Name"
              placeholder="John Smith"
              v-model="fname3"
              class="w-100"
              description-text="This is inline help"
            />
            <vs-select class="w-100 mt-4" label="Gender" v-model="gender3">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options3"
              />
            </vs-select>
            <vs-select class="w-100 mt-4" label="Category" v-model="category3">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options3_1"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-input
              label="Last Name"
              placeholder="12n"
              v-model="lname3"
              class="w-100 mt-4 mt-md-0"
              description-text="This field has error."
            />
            <vs-input label="Date of Birth" type="date" v-model="date3" class="w-100 mt-4" />
            <label class="vs-input--label mt-4">Membership</label>
            <div class="d-flex align-items-center mt-1">
              <vs-radio v-model="radios3" class="mb-0" vs-name="radios3" vs-value="Free">Free</vs-radio>
              <vs-radio v-model="radios3" class="ml-2 mb-0" vs-name="radios3" vs-value="Paid">Paid</vs-radio>
            </div>
          </vs-col>
        </vs-row>
        <h4 class="mt-5 mb-4">Address</h4>
        <hr class="custom-hr" />
        <vs-row>
          <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
            <vs-input label="Street" v-model="street3" class="w-100 mt-4" />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-input label="City" v-model="city3" class="w-100 mt-4" />
            <vs-input label="Post Code" v-model="post3" class="w-100 mt-4" />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-input label="State" v-model="state3" class="w-100 mt-4" />
            <vs-select class="w-100 mt-4" label="Country" v-model="country3">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in countryoptions3"
              />
            </vs-select>
          </vs-col>
        </vs-row>
        <div class="btn-alignment mt-4">
          <vs-button color="success" type="filled">Save</vs-button>
          <vs-button color="dark" type="filled">Cancel</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 4 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Default Basic Forms</h3>
          <h5
            class="card-subtitle font-weight-normal text-muted mb-0"
          >All with vuesax element attributes</h5>
        </div>

        <vs-row>
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Text</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Placeholder" v-model="text4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Search</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
              type="search"
              class="inputx w-100"
              placeholder="Placeholder"
              v-model="search4"
            />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Email</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="email" class="inputx w-100" placeholder="Placeholder" v-model="email4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">URL</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="url" class="inputx w-100" placeholder="Placeholder" v-model="url4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Telephone</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="tel" class="inputx w-100" placeholder="Placeholder" v-model="contact4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Password</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
              type="password"
              class="inputx w-100"
              placeholder="Placeholder"
              v-model="password4"
            />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Number</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
              type="number"
              class="inputx w-100"
              placeholder="Placeholder"
              v-model="number4"
            />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Date and time</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
              type="datetime-local"
              class="inputx w-100"
              placeholder="Placeholder"
              v-model="datetime4"
            />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Date</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="date" class="inputx w-100" placeholder="Placeholder" v-model="date4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Month</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="month" class="inputx w-100" placeholder="Placeholder" v-model="month4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Week</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="week" class="inputx w-100" placeholder="Placeholder" v-model="week4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Time</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="time" class="inputx w-100" placeholder="Placeholder" v-model="time4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Select</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-select class="w-100" v-model="select4">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options4"
              />
            </vs-select>
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Color</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="color" class="inputx w-100" placeholder="Placeholder" v-model="color4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class="d-flex align-items-center">
            <label class="vs-input--label mb-0">Input Range</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="range" class="inputx w-100" placeholder="Placeholder" v-model="range4" />
          </vs-col>
        </vs-row>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 5 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Input groups</h3>
          <h5
            class="card-subtitle font-weight-normal text-muted mb-0"
          >All with vuesax element attributes</h5>
        </div>
        <div>
          <vs-input icon="mode_edit" placeholder="Username" v-model="ig5" class="mt-4 w-100" />
          <vs-input
            icon-after="true"
            placeholder="Recepient's name"
            icon="mode_edit"
            class="mt-4 w-100"
            v-model="ig5_1"
          />
          <vs-input
            icon="attach_money"
            placeholder="Username"
            v-model="ig5_2"
            class="mt-4 w-100 mb-4"
          />
        </div>
        <div class="pt-2 mb-4">
          <hr class="custom-hr" />
          <h4 class="pb-3 pt-3">Group with Label Placeholder</h4>
          <vs-input
            icon-after="true"
            label-placeholder="Label with placeholder"
            icon="mode_edit"
            class="mt-4 w-100"
            v-model="ig5_3"
          />
          <vs-input
            icon="add"
            class="mt-4 w-100"
            label-placeholder="Label with placeholder"
            v-model="ig5_4"
          />
          <vs-input
            icon-no-border
            icon="account_circle"
            class="mt-4 w-100"
            label-placeholder="icon-no-border"
            v-model="ig5_5"
          />
        </div>
        <div class="pt-2">
          <hr class="custom-hr" />
          <h4 class="pb-3 pt-3">Color Label Placeholder</h4>
          <vs-row>
            <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
              <vs-input
                icon-after="true"
                label-placeholder="Label with placeholder (Primary)"
                icon="mode_edit"
                class="mt-4 w-100"
                v-model="colorig_1"
              />
              <vs-input
                icon-after="true"
                label-placeholder="Label with placeholder (warning)"
                icon="mode_edit"
                color="warning"
                class="mt-4 w-100"
                v-model="colorig_3"
              />
              <vs-input
                icon-after="true"
                label-placeholder="Label with placeholder (dark)"
                icon="mode_edit"
                color="dark"
                class="mt-4 w-100"
                v-model="colorig_5"
              />
            </vs-col>
            <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
              <vs-input
                icon-after="true"
                color="success"
                label-placeholder="Label with placeholder (success)"
                icon="mode_edit"
                class="mt-4 w-100"
                v-model="colorig_2"
              />
              <vs-input
                icon-after="true"
                color="danger"
                label-placeholder="Label with placeholder (danger)"
                icon="mode_edit"
                class="mt-4 w-100"
                v-model="colorig_4"
              />
            </vs-col>
          </vs-row>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 6 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Input State</h3>
          <h5
            class="card-subtitle font-weight-normal text-muted mb-0"
          >All with vuesax element attributes</h5>
        </div>
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <label class="vs-input--label">Input with Success</label>
            <vs-input
              :success="true"
              success-text="The mail is valid"
              placeholder="Email Success"
              class="w-100"
              val-icon-success="done"
              v-model="istate1"
            />
            <label class="vs-input--label mt-4">Input with Warning</label>
            <vs-input
              :warning="true"
              warning-text="The entered data could not be verified"
              placeholder="Date Warning"
              v-model="istate3"
              class="w-100"
              val-icon-warning="warning"
            />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <label class="vs-input--label">Input with Danger</label>
            <vs-input
              :danger="true"
              danger-text="The password does not meet the standards"
              placeholder="Password Danger"
              class="w-100"
              val-icon-danger="clear"
              v-model="istate2"
            />
            <label class="vs-input--label mt-4">Input with Sample</label>
            <vs-input
              description-text="Just enter the first two numbers of your phone"
              placeholder="Phone Description"
              class="w-100"
              v-model="istate4"
            />
          </vs-col>
        </vs-row>
        <!-- Input Size -->
        <hr class="custom-hr" />
        <h4>Input Size</h4>
        <vs-row class="mt-4">
          <vs-col vs-lg="4" vs-xs="12" vs-sm="4">
            <vs-input size="large" placeholder="Size large" class="w-100" v-model="size1" />
          </vs-col>
          <vs-col vs-lg="4" vs-xs="12" vs-sm="4" class="mt-4 mt-md-0">
            <vs-input size="default" placeholder="Size default" class="w-100" v-model="size2" />
          </vs-col>
          <vs-col vs-lg="4" vs-xs="12" vs-sm="4" class="mt-4 mt-md-0">
            <vs-input size="small" placeholder="Size small" class="w-100" v-model="size3" />
          </vs-col>
        </vs-row>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 7 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Disabled Form</h3>
          <h5
            class="card-subtitle font-weight-normal text-muted mb-0"
          >All with vuesax element attributes</h5>
        </div>
        <div>
          <label class="vs-input--label">Disabled input</label>
          <vs-input disabled class="inputx w-100" placeholder="Disabled" v-model="dinput1" />
          <label class="vs-input--label mt-4">Disabled select</label>
          <vs-select disabled="true" class="w-100" v-model="dinput7">
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in options7"
            />
          </vs-select>
          <div class="d-flex align-items-center mt-4">
            <vs-checkbox disabled="true" v-model="dinput3">Can't Check This</vs-checkbox>
          </div>
          <vs-button color="primary" type="filled" class="mt-4" disabled="true">Submit</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 8 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Sample Basic Forms</h3>
          <h5
            class="card-subtitle font-weight-normal text-muted mb-0"
          >All with vuesax element attributes</h5>
        </div>
        <div>
          <vs-input label="User Name" placeholder="Enter User Name" class="w-100" v-model="uname8" />
          <vs-input
            label="Email address"
            type="email"
            placeholder="Enter Email address"
            class="w-100 mt-4"
            v-model="email8"
          />
          <vs-input
            label="Password"
            type="password"
            placeholder="Enter Password"
            class="w-100 mt-4"
            v-model="password8"
          />
          <vs-input
            label="Confirm Password"
            type="password"
            placeholder="Enter Confirm Password"
            class="w-100 mt-4"
            v-model="cpassword8"
          />
          <div class="d-flex align-items-center mt-4">
            <vs-checkbox v-model="checkBox8">Remember Me</vs-checkbox>
          </div>
          <div class="btn-alignment mt-4">
            <vs-button color="success" type="filled">Submit</vs-button>
            <vs-button color="dark" type="filled">Cancel</vs-button>
          </div>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 9 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Sample Form with the Icons</h3>
          <h5 class="card-subtitle font-weight-normal text-muted mb-0">Made with vuesax elements</h5>
        </div>
        <div>
          <label class="vs-input--label">User Name</label>
          <vs-input
            icon-no-border
            icon-pack="ti"
            icon="ti-user"
            placeholder="Username"
            class="w-100"
            v-model="icon1"
          />
          <label class="vs-input--label mt-4">Email address</label>
          <vs-input
            icon-no-border
            icon-pack="ti"
            icon="ti-email"
            placeholder="Email"
            class="w-100"
            v-model="icon2"
          />
          <label class="vs-input--label mt-4">Password</label>
          <vs-input
            icon-no-border
            icon-pack="ti"
            icon="ti-lock"
            placeholder="Password"
            class="w-100"
            v-model="icon3"
          />
          <label class="vs-input--label mt-4">Confirm Password</label>
          <vs-input
            icon-no-border
            icon-pack="ti"
            icon="ti-lock"
            placeholder="Confirm Password"
            class="w-100"
            v-model="icon4"
          />
          <div class="d-flex align-items-center mt-4">
            <vs-checkbox v-model="icon5">Remember Me</vs-checkbox>
          </div>
          <div class="btn-alignment mt-4">
            <vs-button color="success" type="filled">Submit</vs-button>
            <vs-button color="dark" type="filled">Cancel</vs-button>
          </div>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 10 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Sample Form with the right Icons</h3>
          <h5 class="card-subtitle font-weight-normal text-muted mb-0">Made with vuesax elements</h5>
        </div>
        <div>
          <label class="vs-input--label">User Name</label>
          <vs-input
            icon="ti-user"
            icon-pack="ti"
            icon-no-border
            icon-after="true"
            placeholder="Username"
            class="w-100"
            v-model="ricon1"
          />
          <label class="vs-input--label mt-4">Email address</label>
          <vs-input
            icon="ti-email"
            icon-pack="ti"
            icon-no-border
            icon-after="true"
            placeholder="Email"
            class="w-100"
            v-model="ricon2"
          />
          <label class="vs-input--label mt-4">Password</label>
          <vs-input
            icon-pack="ti"
            icon="ti-lock"
            icon-no-border
            icon-after="true"
            placeholder="Password"
            class="w-100"
            v-model="ricon3"
          />
          <label class="vs-input--label mt-4">Confirm Password</label>
          <vs-input
            icon-pack="ti"
            icon="ti-lock"
            icon-no-border
            icon-after="true"
            placeholder="Confirm Password"
            class="w-100"
            v-model="ricon4"
          />
          <div class="d-flex align-items-center mt-4">
            <vs-checkbox v-model="ricon5">Remember Me</vs-checkbox>
          </div>
          <div class="btn-alignment mt-4">
            <vs-button color="success" type="filled">Submit</vs-button>
            <vs-button color="dark" type="filled">Cancel</vs-button>
          </div>
        </div>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "formBasic",
  data: () => ({
    title: "formBasic",
    //     General Form
    email1: "",
    checkBox1: false,
    password1: "",
    //     Default Form
    name2: "George deo...",
    email2: "",
    help2: "",
    password2: "",
    placeholder2: "",
    textarea2: "",
    dinput2: "",
    radio2: "val1",
    switch2: false,
    switch2_1: false,
    select2: 0,
    options2: [
      { text: "Choose Your Option", value: 0 },
      { text: "IT", value: 1 },
      { text: "Blade Runner", value: 2 },
      { text: "Thor Ragnarok", value: 3 }
    ],
    custom2: false,
    custom2_1: false,
    custom2_2: false,
    //     Other Sample Form
    fname3: "",
    lname3: "",
    gender3: 1,
    options3: [{ text: "Male", value: 1 }, { text: "Female", value: 2 }],
    date3: "",
    category3: 1,
    options3_1: [
      { text: "Category 1", value: 1 },
      { text: "Category 2", value: 2 },
      { text: "Category 3", value: 3 },
      { text: "Category 4", value: 4 }
    ],
    radios3: "Free",
    street3: "",
    city3: "",
    state3: "",
    post3: "",
    country3: 0,
    countryoptions3: [
      { text: "-- Select Your Country", value: 0 },
      { text: "India", value: 2 },
      { text: "United Kindom", value: 3 }
    ],
    //     Default basic forms
    text4: "Artisanal kale",
    search4: "How do I shoot web",
    email4: "bootstrap@example.com",
    url4: "https://getbootstrap.com",
    contact4: "1-(555)-555-5555",
    password4: "456",
    number4: "29",
    datetime4: "2011-08-19T13:45:00",
    date4: "2011-08-19",
    month4: "2011-08",
    week4: "2011-W33",
    time4: "13:45:00",
    select4: 0,
    options4: [
      { text: "Choose...", value: 0 },
      { text: "One", value: 2 },
      { text: "Two", value: 3 },
      { text: "Three", value: 4 }
    ],
    color4: "#563d7c",
    range4: "50",
    //     Input Groups
    ig5: "",
    ig5_1: "",
    ig5_2: "",
    ig5_3: "",
    ig5_4: "",
    ig5_5: "",
    colorig_1: "",
    colorig_2: "",
    colorig_3: "",
    colorig_4: "",
    colorig_5: "",
    istate1: "",
    istate2: "",
    istate3: "",
    istate4: "",
    size1: "",
    size2: "",
    size3: "",
    //     Disabled Form
    dinput1: "",
    dinput3: "",
    dinput7: 0,
    options7: [
      { text: "IT", value: 0 },
      { text: "Blade Runner", value: 2 },
      { text: "Thor Ragnarok", value: 3 }
    ],
    //     Simple Basic Form
    uname8: "",
    email8: "",
    password8: "",
    cpassword8: "",
    checkBox8: "",
    //     Left side Icon
    icon1: "",
    icon2: "",
    icon3: "",
    icon4: "",
    icon5: "",
    //     Right side Icon
    ricon1: "",
    ricon2: "",
    ricon3: "",
    ricon4: "",
    ricon5: ""
  })
};
</script>