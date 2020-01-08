<template>
  <vs-row>
    <!-- ////////// 
          Card 1 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Project Assigning</h3>
        <vs-alert :active.sync="projectalert1" class="mb-3 font-weight-bold">
          <vs-button color="primary" type="filled" size="small" class="mr-2 font-weight-bold">i</vs-button>Form Action at Left ending of the form.
        </vs-alert>
        <h6 class="card-subtitle text-muted font-weight-normal">
          To use add form actions on bottom of the form add a div with
          <code>.action-form</code> class to ending the form.
        </h6>
        <hr class="custom-hr" />
        <!-- Section 1 -->
        <h4 class>Personal Info</h4>
        <vs-row class="mt-4">
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input
              label="First Name"
              class="w-100"
              placeholder="First Name Here"
              v-model="fname1"
            />
            <vs-input
              type="email"
              label="Email"
              placeholder="Email Here"
              class="mt-3 w-100"
              v-model="email1"
            />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" class="mb-4">
            <vs-input
              label="Last Name"
              class="mt-3 mt-md-0 w-100"
              placeholder="Last Name Here"
              v-model="lname1"
            />
            <vs-input
              label="Contact"
              placeholder="Contact Here"
              class="mt-3 w-100"
              v-model="contact1"
            />
          </vs-col>
        </vs-row>
        <!-- End Section 1 -->
        <!-- Section 2 -->
        <hr class="custom-hr" />
        <h4 class="pt-3">Requirements</h4>
        <vs-row class="mt-4">
          <vs-col vs-lg="12" vs-xs="12">
            <vs-input
              label="Company"
              class="w-100"
              placeholder="Company Name Here"
              v-model="company1"
            />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12">
            <vs-select class="mt-3 w-100" label="Interested In" v-model="interested1">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in interestedoptions1"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12">
            <vs-select class="mt-3 w-100" label="Budget" v-model="budget1">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in budgetoptions1"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="12" vs-xs="12">
            <vs-textarea
              counter="20"
              class="w-100 mt-3"
              label="About Project"
              placeholder="About Project Here"
              :counter-danger.sync="counterDanger"
              v-model="aboutp1"
            />
          </vs-col>
        </vs-row>
        <hr class="custom-hr" />
        <div class="btn-alignment">
          <vs-button>Save</vs-button>
          <vs-button color="dark">Cancel</vs-button>
        </div>
        <!-- End Section 2 -->
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 2 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Employee Profile</h3>
        <vs-alert :active.sync="projectalert2" class="mb-3 font-weight-bold">
          <vs-button color="primary" type="filled" size="small" class="mr-2 font-weight-bold">i</vs-button>Form Action at Right ending of the form.
        </vs-alert>
        <h6 class="card-subtitle text-muted font-weight-normal">
          To use add form actions on bottom of the form add a div with
          <code>.action-form</code> class to begining the form.
        </h6>
        <h4 class="pb-2">About Employee</h4>
        <hr class="custom-hr" />
        <!-- Section 1 -->
        <vs-row class="mt-4">
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input
              label="First Name"
              class="w-100"
              placeholder="First Name Here"
              v-model="fname2"
            />
            <vs-input
              label="Username"
              placeholder="Username Here"
              class="mt-3 w-100"
              v-model="uname2"
            />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" class="mb-4">
            <vs-input
              label="Last Name"
              class="mt-3 mt-md-0 w-100"
              placeholder="Last Name Here"
              v-model="lname2"
            />
            <vs-input
              label="Nick Name"
              placeholder="Nick Name Here"
              class="mt-3 w-100"
              v-model="nickname2"
            />
          </vs-col>
        </vs-row>
        <!-- End Section 1 -->
        <!-- Section 2 -->
        <hr class="custom-hr" />
        <h4 class="pt-3">Contact Info & Bio</h4>
        <vs-row class="mt-4">
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input
              type="email"
              label="Email"
              class="w-100"
              placeholder="Email Here"
              v-model="email2"
            />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input label="Website" class="w-100" placeholder="http://" v-model="website2" />
          </vs-col>
          <vs-col vs-lg="12" vs-xs="12">
            <vs-input
              label="Contact No"
              class="w-100 mt-3"
              placeholder="Contact No here"
              v-model="contact2"
            />
          </vs-col>
          <vs-col vs-lg="12" vs-xs="12">
            <vs-textarea
              counter="20"
              class="w-100 mt-3"
              label="Bio"
              placeholder="Bio Here"
              :counter-danger.sync="counterDanger"
              v-model="bio1"
            />
          </vs-col>
        </vs-row>
        <hr class="custom-hr" />
        <div class="btn-alignment text-right">
          <vs-button class="mb-0">Save</vs-button>
          <vs-button class="mb-0" color="dark">Cancel</vs-button>
        </div>
        <!-- End Section 2 -->
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 3 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <div class="d-inline-block d-md-flex align-items-center mb-3">
          <h3 class="card-title">Donation</h3>
          <div class="ml-auto">
            <vs-input icon="search" placeholder="Search Here" v-model="search3" />
          </div>
        </div>
        <vs-alert :active.sync="projectalert3" class="mb-3 font-weight-bold">
          <vs-button color="primary" type="filled" size="small" class="mr-2 font-weight-bold">i</vs-button>Form Action at center align of the form
        </vs-alert>
        <h6 class="card-subtitle text-muted font-weight-normal">
          To use add form actions on top of the form add a div with
          <code>.action-form</code> class to the ending of the form. To set a side of the button use
          <code>.text-center</code> as per requirement.
        </h6>
        <!-- Section 1 -->
        <vs-row class="mt-4">
          <vs-col vs-lg="12" vs-xs="12">
            <vs-input
              label="Full Name"
              class="w-100"
              placeholder="Full Name Here"
              v-model="fname3"
            />
            <vs-input
              type="email"
              label="Email"
              placeholder="Email Here"
              class="mt-3 w-100"
              v-model="email3"
            />
            <vs-input
              label="Contact No"
              placeholder="Contact No Here"
              class="mt-3 w-100"
              v-model="contact3"
            />
            <vs-input
              label="Donation Type"
              placeholder="Donation Type Here"
              class="mt-3 w-100"
              v-model="donation3"
            />
            <vs-input
              label="Amount"
              icon="attach_money"
              class="mt-3 w-100"
              placeholder="Amount Here"
              v-model="amount3"
            />
            <vs-textarea
              counter="20"
              class="w-100 mt-3"
              label="Comments"
              placeholder="Comments Here"
              :counter-danger.sync="counterDanger"
              v-model="comments3"
            />
          </vs-col>
        </vs-row>
        <!-- End Section 1 -->
        <!-- Section 2 -->
        <hr class="custom-hr" />
        <div class="btn-alignment text-center">
          <vs-button class="mb-0">Save</vs-button>
          <vs-button class="mb-0" color="dark">Cancel</vs-button>
        </div>
        <!-- End Section 2 -->
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 4 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <div class="d-flex align-items-center mb-3">
          <h3 class="card-title">Complaint Form</h3>
          <div class="ml-auto">
            <vs-dropdown vs-custom-content vs-trigger-click>
              <a class="a-icon" href="#">
                <vs-icon class icon="more_vert"></vs-icon>
              </a>
              <vs-dropdown-menu>
                <vs-dropdown-item>Insert</vs-dropdown-item>
                <vs-dropdown-item>update</vs-dropdown-item>
                <vs-dropdown-item divider>Delete</vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </div>
        </div>
        <vs-alert :active.sync="projectalert4" class="mb-3 font-weight-bold">
          <vs-button color="primary" type="filled" size="small" class="mr-2 font-weight-bold">i</vs-button>Form Action at center align of the form
        </vs-alert>
        <h6 class="card-subtitle text-muted font-weight-normal">
          To use add form actions on top of the form add a div with
          <code>.action-form</code> class to the ending of the form. To set a side of the button use
          <code>.text-center</code> as per requirement.
        </h6>
        <!-- Section 1 -->
        <vs-row class="my-4">
          <vs-col vs-lg="12" vs-xs="12">
            <vs-input label="Company" class="w-100" placeholder="Company Here" v-model="company4" />
            <vs-input
              label="Employee Name"
              placeholder="Employee Name Here"
              class="mt-3 w-100"
              v-model="ename4"
            />
            <vs-input label="Date of Complaint" type="date" class="mt-3 w-100" v-model="date4" />
            <vs-input
              label="Supervisor's Name"
              placeholder="Supervisor's Name Here"
              class="mt-3 w-100"
              v-model="sname4"
            />
            <vs-textarea
              counter="20"
              class="w-100 mt-3"
              label="Complaint"
              placeholder="Complaint Here"
              :counter-danger.sync="counterDanger"
              v-model="complaint4"
            />
            <vs-input
              label="Signature"
              icon="attach_money"
              class="mt-3 w-100"
              placeholder="Signature Here"
              v-model="sig4"
            />
          </vs-col>
        </vs-row>
        <!-- End Section 1 -->
        <!-- Section 2 -->
        <hr class="custom-hr" />
        <div class="btn-alignment text-center">
          <vs-button class="mb-0">Save</vs-button>
          <vs-button class="mb-0" color="dark">Cancel</vs-button>
        </div>
        <!-- End Section 2 -->
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 5 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Employee Timing</h3>
        <vs-alert :active.sync="projectalert5" class="mb-3 font-weight-bold">
          <vs-button color="primary" type="filled" size="small" class="mr-2 font-weight-bold">i</vs-button>Form Action at left ending of the form.
        </vs-alert>
        <h6 class="card-subtitle text-muted font-weight-normal">
          To use add form actions on top of the form add a div with
          <code>.action-form</code> class to left ending of the form. To set a side of the button use
          <code>.text-left</code> or
          <code>.text-right</code> as per requirement.
        </h6>
        <hr class="custom-hr" />
        <!-- Section 1 -->
        <vs-row class="mt-4">
          <vs-col vs-lg="12" vs-xs="12">
            <vs-input
              label="Employee Name"
              class="w-100"
              icon="account_circle"
              placeholder="Employee Name Here"
              v-model="ename5"
            />

            <vs-input
              label="Project Name"
              icon="assignment"
              placeholder="Project Name Here"
              class="mt-3 w-100"
              v-model="pname5"
            />

            <vs-input type="date" label="Date" class="mt-3 w-100" v-model="date5" />

            <vs-input
              label="Rate Per Hour"
              icon="attach_money"
              placeholder="Amount Here"
              class="mt-3 w-100"
              v-model="amount5"
            />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input type="date" label="Start Time" class="mt-3 w-100" v-model="sdate5" />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input type="date" label="End Time" class="mt-3 w-100" v-model="edate5" />
          </vs-col>
          <vs-col vs-lg="12">
            <vs-textarea
              counter="20"
              class="w-100 mt-3"
              label="Notes"
              placeholder="Notes Here"
              :counter-danger.sync="counterDanger"
              v-model="note5"
            />
          </vs-col>
        </vs-row>
        <!-- End Section 1 -->
        <!-- Section 2 -->
        <hr class="custom-hr" />
        <div class="btn-alignment">
          <vs-button>Save</vs-button>
          <vs-button color="dark">Cancel</vs-button>
        </div>
        <!-- End Section 2 -->
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 6 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Issue Tracking</h3>
        <vs-alert :active.sync="projectalert6" class="mb-3 font-weight-bold">
          <vs-button color="primary" type="filled" size="small" class="mr-2 font-weight-bold">i</vs-button>Form Action at left ending of the form.
        </vs-alert>
        <h6 class="card-subtitle text-muted font-weight-normal">
          To use add form actions on top of the form add a div with
          <code>.action-form</code> class to ending of the form. To set a side of the button use
          <code>.text-right</code> or
          <code>.text-left</code> as per requirement.
        </h6>
        <hr class="custom-hr" />
        <!-- Section 1 -->
        <vs-row class="mt-4">
          <vs-col vs-lg="12" vs-xs="12">
            <vs-input
              label="Issue Title"
              class="w-100"
              placeholder="Issue Title Here"
              v-model="ititle6"
            />

            <vs-input
              label="Opened By"
              placeholder="Opened By Here"
              class="mt-3 w-100"
              v-model="open6"
            />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input type="date" label="Date Opened" class="mt-3 w-100" v-model="odate6" />
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12">
            <vs-input type="date" label="Date Fixed" class="mt-3 w-100" v-model="fdate6" />
          </vs-col>
          <vs-col vs-lg="12">
            <vs-select class="mt-3 w-100" label="Priority" v-model="Priorityselect1">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in Priorityoptions1"
              />
            </vs-select>
            <vs-select class="mt-3 w-100" label="Status" v-model="Statusselect1">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in Statusoptions1"
              />
            </vs-select>
            <vs-textarea
              counter="20"
              class="w-100 mt-3"
              label="Comments"
              placeholder="Comments Here"
              :counter-danger.sync="counterDanger"
              v-model="comment6"
            />
          </vs-col>
        </vs-row>
        <!-- End Section 1 -->
        <!-- Section 2 -->
        <hr class="custom-hr" />
        <div class="btn-alignment text-right">
          <vs-button>Save</vs-button>
          <vs-button color="dark">Cancel</vs-button>
        </div>
        <!-- End Section 2 -->
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 7 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Event Registration</h3>
        <vs-alert :active.sync="projectalert6" class="mb-3 font-weight-bold">
          <vs-button color="primary" type="filled" size="small" class="mr-2 font-weight-bold">i</vs-button>Form Action at mulitple space top,bottom and left,right.
        </vs-alert>
        <h6 class="card-subtitle text-muted font-weight-normal">
          To use add class
          <code>.action-form</code> at which side you want to add buttons.
        </h6>
        <hr class="custom-hr" />
        <!-- Section 1 -->
        <vs-row class="my-4 pt-2 pb-3">
          <vs-col vs-lg="12" vs-xs="12">
            <vs-input
              label="Full Name"
              class="w-100"
              placeholder="Full Name Here"
              v-model="fname7"
            />

            <vs-input label="Title" placeholder="Title Here" class="mt-3 w-100" v-model="title7" />

            <vs-input
              label="Company Name"
              placeholder="Company Name Here"
              class="mt-3 w-100"
              v-model="company7"
            />

            <vs-input
              type="email"
              label="Email"
              placeholder="Email Here"
              class="mt-3 w-100"
              v-model="email7"
            />

            <vs-input
              label="Contact No"
              placeholder="Contact No Here"
              class="mt-3 w-100"
              v-model="contact7"
            />

            <label class="vs-input--label mt-3">Existing Customer</label>
            <div class="d-flex align-items-center">
              <div>
                <vs-radio v-model="radios7" vs-name="radios7" vs-value="yes">Yes</vs-radio>
                <vs-radio v-model="radios7" vs-name="radios7" vs-value="no">No</vs-radio>
              </div>
            </div>
          </vs-col>
        </vs-row>
        <!-- End Section 1 -->
        <!-- Section 2 -->
        <hr class="custom-hr" />
        <div class="d-inline-block d-md-flex align-items-center">
          <div class="btn-alignment">
            <vs-button>Save</vs-button>
            <vs-button color="dark">Cancel</vs-button>
          </div>
          <div class="ml-auto mt-3 mt-md-0">
            <div class="d-flex align-items-center">
              <div class="d-flex align-items-center dropdownbtn-alignment">
                <vs-button class="btnx" type="filled" color="primary">
                  <i class="ti-download mr-2"></i>Import
                </vs-button>
                <vs-dropdown>
                  <vs-button class="btn-drop" type="filled" color="primary" icon="expand_more"></vs-button>
                  <vs-dropdown-menu>
                    <vs-dropdown-item>option 1</vs-dropdown-item>
                    <vs-dropdown-item>option 2</vs-dropdown-item>
                    <vs-dropdown-group>
                      <vs-dropdown-item>option 1</vs-dropdown-item>
                      <vs-dropdown-item>option 2</vs-dropdown-item>
                    </vs-dropdown-group>
                    <vs-dropdown-item divider>option 3</vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
              <div class="d-flex align-items-center dropdownbtn-alignment ml-3">
                <vs-button class="btnx" type="filled" color="danger">
                  <i class="ti-upload mr-2"></i>Export
                </vs-button>
                <vs-dropdown>
                  <vs-button class="btn-drop" type="filled" color="danger" icon="expand_more"></vs-button>
                  <vs-dropdown-menu>
                    <vs-dropdown-item>option 1</vs-dropdown-item>
                    <vs-dropdown-item>option 2</vs-dropdown-item>
                    <vs-dropdown-group>
                      <vs-dropdown-item>option 1</vs-dropdown-item>
                      <vs-dropdown-item>option 2</vs-dropdown-item>
                    </vs-dropdown-group>
                    <vs-dropdown-item divider>option 3</vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
              <div class="d-flex align-items-center dropdownbtn-alignment ml-3">
                <vs-button class="btnx" type="filled" color="success">
                  <i class="ti-cloud-down mr-2"></i>Upload
                </vs-button>
                <vs-dropdown>
                  <vs-button class="btn-drop" type="filled" color="success" icon="expand_more"></vs-button>
                  <vs-dropdown-menu>
                    <vs-dropdown-item>option 1</vs-dropdown-item>
                    <vs-dropdown-item>option 2</vs-dropdown-item>
                    <vs-dropdown-group>
                      <vs-dropdown-item>option 1</vs-dropdown-item>
                      <vs-dropdown-item>option 2</vs-dropdown-item>
                    </vs-dropdown-group>
                    <vs-dropdown-item divider>option 3</vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </div>
          </div>
        </div>
        <!-- End Section 2 -->
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "formAction",
  data: () => ({
    title: "formAction",
    // Project Assigning Data
    projectalert1: true,
    fname1: "",
    lname1: "",
    email1: "",
    contact1: "",
    company1: "",
    interested1: 0,
    budget1: 0,
    aboutp1: "",
    counterDanger: false,
    interestedoptions1: [
      { text: "Choose Your Option", value: 0 },
      { text: "Designing", value: 2 },
      { text: "Development", value: 3 }
    ],
    budgetoptions1: [
      { text: "Choose Your Option", value: 0 },
      { text: "Less than $5000", value: 2 },
      { text: "$5000 - $10,000", value: 3 }
    ],
    // Employee Profile Data
    projectalert2: true,
    fname2: "",
    lname2: "",
    uname2: "",
    nickname2: "",
    email2: "",
    website2: "",
    contact2: "",
    bio1: "",
    // Donation data
    projectalert3: true,
    search3: "",
    fname3: "",
    email3: "",
    contact3: "",
    donation3: "",
    comments3: "",
    amount3: "",
    // Complaint Form Data
    projectalert4: true,
    company4: "",
    ename4: "",
    date4: "",
    sname4: "",
    complaint4: "",
    sig4: "",
    // Employee Timing Data
    projectalert5: true,
    ename5: "",
    pname5: "",
    date5: "",
    amount5: "",
    sdate5: "",
    edate5: "",
    note5: "",
    // Issue Tracking Date
    projectalert6: true,
    ititle6: "",
    open6: "",
    odate6: "",
    fdate6: "",
    comment6: "",
    Priorityselect1: 0,
    Priorityoptions1: [
      { text: "Low", value: 0 },
      { text: "Medium", value: 2 },
      { text: "High", value: 3 }
    ],
    Statusselect1: 0,
    Statusoptions1: [
      { text: "Started", value: 0 },
      { text: "Not Started", value: 2 },
      { text: "Fixed", value: 3 }
    ],
    // Event Registration Data
    projectalert7: true,
    fname7: "",
    title7: "",
    company7: "",
    email7: "",
    contact7: "",
    radios7: "yes"
  })
};
</script>