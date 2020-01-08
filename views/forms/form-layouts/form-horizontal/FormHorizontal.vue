<template>
  <vs-row>
    <!-- ////////// 
          Card 1 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Project Assigning</h3>
        <h5 class="card-subtitle font-weight-normal text-muted">
          This is the basic horizontal form with labels on left and form controls on right in one line. To use add class
          <code>form-horizontal</code> to the form tag and give class row with form-group.
        </h5>
        <hr class="custom-hr" />
        <h4 class="mt-4">Personal Info</h4>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">First Name</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="First Name Here" v-model="project1" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Last Name</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Last Name Here" v-model="project2" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Email</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
              type="email"
              class="inputx w-100"
              placeholder="Email Here"
              v-model="project3"
            />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Contact No</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
              type="tel"
              class="inputx w-100"
              placeholder="Contact No Here"
              v-model="project4"
            />
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <h4 class="mt-4 pt-2">Requirements</h4>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Company</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Company Name Here" v-model="project5" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Interested In</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-select class="w-100" v-model="projectselect6">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in projectoptions6"
              />
            </vs-select>
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Budget</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-select class="w-100" v-model="projectselect7">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in projectoptions7"
              />
            </vs-select>
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">About Project</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="About Project Here" v-model="project8" />
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button color="primary" type="filled">Save</vs-button>
          <vs-button color="dark" type="filled">Cancel</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 2 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Employee Profile</h3>
        <h5 class="card-subtitle font-weight-normal text-muted">
          This is the employee profile form with labels on left and form controls on right in one line two controls. To use add class
          <code>form-horizontal</code> to the form tag and give class
          <code>row</code> with form-group.
        </h5>
        <hr class="custom-hr" />
        <h4 class="mt-4">Employee User</h4>
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">First Name</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="First Name Here" v-model="employee1" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Username</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Username Here" v-model="employee3" />
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Last Name</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Last Name Here" v-model="employee2" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Nick Name</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Nick Name Here" v-model="employee4" />
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <h4 class="mt-4 pt-2">Contact Info & Bio</h4>
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Email</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input
                  type="email"
                  class="inputx w-100"
                  placeholder="Email Here"
                  v-model="employee5"
                />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Contact No</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input
                  type="tel"
                  class="inputx w-100"
                  placeholder="Contact No Here"
                  v-model="employee6"
                />
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Website</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input
                  type="url"
                  class="inputx w-100"
                  placeholder="http://"
                  v-model="employee7"
                />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Bio</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Bio Here" v-model="employee8" />
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button color="primary" type="filled">Save</vs-button>
          <vs-button color="dark" type="filled">Cancel</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 3 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Employee Timing</h3>
        <h5 class="card-subtitle font-weight-normal text-muted">
          This is the employee timing form with labels on left and form controls on right in one line. To use add class
          <code>form-horizontal</code> to the form tag and give class
          <code>row</code> with form-group.
        </h5>
        <hr class="custom-hr" />
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Employee Name</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Employee Name Here" v-model="time1" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Project Name</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Project Name Here" v-model="time2" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Date</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="date" class="inputx w-100" v-model="time3" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Rate Per Hour</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Rate Per Hour Here" v-model="time4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Start Time</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="time" class="inputx w-100" v-model="time5" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">End Time</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="time" class="inputx w-100" v-model="time6" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Notes</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input placeholder="Notes Here" class="inputx w-100" v-model="time7" />
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button color="primary" type="filled">Save</vs-button>
          <vs-button color="dark" type="filled">Cancel</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 4 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Event Registration</h3>
        <h5 class="card-subtitle font-weight-normal text-muted">
          This is the event registration form with labels on left and form controls on right in one line. To use add class
          <code>form-horizontal</code> to the form tag and give class
          <code>row</code> with form-group.
        </h5>
        <hr class="custom-hr" />
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Full Name</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Full Name Here" v-model="event1" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Title</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Title Here" v-model="event2" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Company</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input class="inputx w-100" placeholder="Company Name Here" v-model="event3" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Email</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input type="email" class="inputx w-100" placeholder="Email Here" v-model="event4" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Contact No</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
              type="tel"
              class="inputx w-100"
              placeholder="Contact No Here"
              v-model="event5"
            />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
            vs-lg="2"
            vs-xs="12"
            vs-sm="4"
            class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">Existing Customer</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <div class="d-flex align-items-center mt-1">
              <vs-radio v-model="event6" vs-name="event6" vs-value="Yes" class="mr-2">Yes</vs-radio>
              <vs-radio v-model="event6" vs-name="event6" vs-value="No">No</vs-radio>
            </div>
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button color="primary" type="filled">Save</vs-button>
          <vs-button color="dark" type="filled">Cancel</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 5 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Other Sample Horizontal form</h3>
        <h5 class="card-subtitle font-weight-normal text-muted">
          This is the sample horizontal form with labels on left and form controls on right in one line. To use add class
          <code>form-horizontal</code> to the form tag and give class
          <code>row</code> with form-group.
        </h5>
        <hr class="custom-hr" />
        <h4 class="mt-4">Person Info</h4>
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">First Name</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input
                  class="inputx w-100"
                  placeholder="John Deo"
                  v-model="sample1"
                  description-text="This is inline Help"
                />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Gender</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-select
                  class="w-100"
                  v-model="sampleselect2"
                  description-text="Select your gender."
                >
                  <vs-select-item
                    :key="index"
                    :value="item.value"
                    :text="item.text"
                    v-for="(item,index) in sampleoptions2"
                  />
                </vs-select>
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Category</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-select class="w-100" v-model="sampleselect3">
                  <vs-select-item
                    :key="index"
                    :value="item.value"
                    :text="item.text"
                    v-for="(item,index) in sampleoptions3"
                  />
                </vs-select>
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Last Name</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input
                  class="inputx w-100"
                  placeholder="12n"
                  v-model="sample4"
                  description-text="This field has error."
                />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Date of Birth</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input type="date" class="inputx w-100" v-model="sample5" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4 pt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Membership</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <div class="d-flex align-items-center">
                  <vs-radio v-model="sample6" vs-name="sample6" class="mr-2" vs-value="Yes">Yes</vs-radio>
                  <vs-radio v-model="sample6" vs-name="sample6" vs-value="No">No</vs-radio>
                </div>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <h4 class="mt-4 pt-2">Address</h4>
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Address 1</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Address 1 Here" v-model="sample7" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">City</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="City Here" v-model="sample8" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Post Code</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Post Code Here" v-model="sample9" />
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Address2</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Address2 Here" v-model="sample10" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">State</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="State Here" v-model="sample11" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Country</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-select class="w-100" v-model="sampleselect12">
                  <vs-select-item
                    :key="index"
                    :value="item.value"
                    :text="item.text"
                    v-for="(item,index) in sampleoptions12"
                  />
                </vs-select>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button color="primary" type="filled">Submit</vs-button>
          <vs-button color="dark" type="filled">Cancel</vs-button>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 6 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Form with left Icons</h3>
          <h5 class="card-subtitle font-weight-normal text-muted mb-0">Made with vuesax elements</h5>
        </div>
        <div>
          <vs-row>
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">UserName*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon="ti-user"
                icon-pack="ti"
                icon-no-border
                placeholder="Username"
                class="w-100"
                v-model="licon1"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Email*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon="ti-email"
                icon-pack="ti"
                icon-no-border
                placeholder="Email"
                class="w-100"
                v-model="licon2"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Website</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon-pack="ti"
                icon="ti-lock"
                icon-no-border
                placeholder="Password"
                class="w-100"
                v-model="licon3"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Password*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon-pack="ti"
                icon="ti-lock"
                icon-no-border
                placeholder="Enter Password"
                class="w-100"
                v-model="licon4"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Re Password*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon-pack="ti"
                icon="ti-lock"
                icon-no-border
                placeholder="Re Enter Password"
                class="w-100"
                v-model="licon5"
              />
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col vs-offset="3">
              <div class="d-flex align-items-center mt-4">
                <vs-checkbox v-model="licon6">Check me out!</vs-checkbox>
              </div>
              <div class="btn-alignment mt-4">
                <vs-button color="primary" type="filled">Sing in</vs-button>
              </div>
            </vs-col>
          </vs-row>
        </div>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 7 
    /////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
      <vs-card>
        <div slot="header">
          <h3 class="card-title">Form with right Icons</h3>
          <h5 class="card-subtitle font-weight-normal text-muted mb-0">Made with vuesax elements</h5>
        </div>
        <div>
          <vs-row>
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">UserName*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon="ti-user"
                icon-pack="ti"
                icon-no-border
                icon-after="true"
                placeholder="Username"
                class="w-100"
                v-model="ricon1"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Email*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon="ti-email"
                icon-pack="ti"
                icon-no-border
                icon-after="true"
                placeholder="Email"
                class="w-100"
                v-model="ricon2"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Website</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon-pack="ti"
                icon="ti-lock"
                icon-no-border
                icon-after="true"
                placeholder="Password"
                class="w-100"
                v-model="ricon3"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Password*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon-pack="ti"
                icon="ti-lock"
                icon-no-border
                icon-after="true"
                placeholder="Enter Password"
                class="w-100"
                v-model="ricon4"
              />
            </vs-col>
          </vs-row>
          <vs-row class="mt-4">
            <vs-col vs-lg="3" vs-xs="12" vs-sm="3" class="d-flex align-items-center">
              <label class="vs-input--label mb-0">Re Password*</label>
            </vs-col>
            <vs-col vs-lg="9" vs-xs="12" vs-sm="9">
              <vs-input
                icon-pack="ti"
                icon="ti-lock"
                icon-no-border
                icon-after="true"
                placeholder="Re Enter Password"
                class="w-100"
                v-model="ricon5"
              />
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col vs-offset="3">
              <div class="d-flex align-items-center mt-4">
                <vs-checkbox v-model="ricon6">Check me out!</vs-checkbox>
              </div>
              <div class="btn-alignment mt-4">
                <vs-button color="primary" type="filled">Sing in</vs-button>
              </div>
            </vs-col>
          </vs-row>
        </div>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "formHorizontal",
  data: () => ({
    title: "formHorizontal",
    // Project assinging
    project1: "",
    project2: "",
    project3: "",
    project4: "",
    project5: "",
    projectselect6: 0,
    projectoptions6: [
      { text: "Choose Your option", value: 0 },
      { text: "Designing", value: 1 },
      { text: "Development", value: 2 }
    ],
    projectselect7: 0,
    projectoptions7: [
      { text: "Choose Your option", value: 0 },
      { text: "Less than $5000", value: 1 },
      { text: "$5000 to $10000", value: 2 }
    ],
    project8: "",
    //     Employee Profile
    employee1: "",
    employee2: "",
    employee3: "",
    employee4: "",
    employee5: "",
    employee6: "",
    employee7: "",
    employee8: "",
    //     Employee Timing
    time1: "",
    time2: "",
    time3: "",
    time4: "",
    time5: "",
    time6: "",
    time7: "",
    //     Event Registration
    event1: "",
    event2: "",
    event3: "",
    event4: "",
    event5: "",
    event6: "",
    //     Sample Horizontal Form
    sample1: "",
    sampleselect2: 0,
    sampleoptions2: [{ text: "Male", value: 0 }, { text: "Female", value: 2 }],
    sampleselect3: 0,
    sampleoptions3: [
      { text: "Category1", value: 0 },
      { text: "Category2", value: 2 }
    ],
    sample4: "",
    sample5: "",
    sample6: "",
    sample7: "",
    sample8: "",
    sample9: "",
    sample10: "",
    sample11: "",
    sampleselect12: 0,
    sampleoptions12: [
      { text: "Country 1", value: 0 },
      { text: "Country 2", value: 2 }
    ],
    //     Left Icon
    licon1: "",
    licon2: "",
    licon3: "",
    licon4: "",
    licon5: "",
    licon6: "",
    //     Right Icon
    ricon1: "",
    ricon2: "",
    ricon3: "",
    ricon4: "",
    ricon5: "",
    ricon6: ""
  })
};
</script>