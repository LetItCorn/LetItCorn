<template>
  <div class="container-fluid">
    <div
      class="page-header min-height-300 border-radius-xl mt-4"
      style="background-image: url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');"
    >
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>

    <div class="card card-body mx-3 mx-md-4 mt-n6">
      <div class="row gx-4">
        <div class="col-auto">
          <div class="avatar avatar-xl position-relative">
            <img
              src="@/assets/img/bruce-mars.jpg"
              alt="profile_image"
              class="shadow-sm w-100 border-radius-lg"
            />
          </div>
        </div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <h5 class="mb-1">Richard Davis</h5>
            <p class="mb-0 font-weight-normal text-sm">CEO / Co-Founder</p>
          </div>
        </div>

        <div class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0">
          <div class="nav-wrapper position-relative end-0">
            <ul class="p-1 bg-transparent nav nav-pills nav-fill" role="tablist">
              <li class="nav-item">
                <a class="px-0 py-1 mb-0 nav-link active" href="javascript:;" role="tab">App</a>
              </li>
              <li class="nav-item">
                <a class="px-0 py-1 mb-0 nav-link" href="javascript:;" role="tab">Messages</a>
              </li>
              <li class="nav-item">
                <a class="px-0 py-1 mb-0 nav-link" href="javascript:;" role="tab">Settings</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 등록한 컴포넌트 실제 사용 -->
      <div class="row mt-4">
        <div class="col-12 col-md-6 col-xl-4">
          <profile-info-card
            title="Profile Information"
            description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful."
            :info="{
              fullName: 'Alec M. Thompson',
              mobile: '(44) 123 1234 123',
              email: 'alecthompson@mail.com',
              location: 'USA',
            }"
            :social="[
              { link: 'https://facebook.com', icon: 'fa-facebook' },
              { link: 'https://twitter.com', icon: 'fa-twitter' },
              { link: 'https://instagram.com', icon: 'fa-instagram' }
            ]"
            :action="{ route: 'javascript:;', tooltip: 'Edit Profile' }"
          />
        </div>

        <div class="col-12 col-md-6 col-xl-4">
          <default-project-card
            title="Modern"
            :image="img1"
            label="Project #2"
            description="Uber is working through a huge amount of internal management turmoil."
            :authors="[
              { image: team1, name: 'Elena Morison' },
              { image: team2, name: 'Ryan Milly' },
              { image: team3, name: 'Nick Daniel' },
              { image: team4, name: 'Peterson' }
            ]"
            :action="{ color: 'success', label: 'View Project' }"
          />
        </div>

        <div class="col-12 col-md-6 col-xl-4">
          <material-switch
            id="rememberMe"
            label-class="text-dark"
            name="rememberMe"
            >Remember me</material-switch
          >
        </div>
      </div>

      <!-- 추가로 Conversations 쪽에서도 MaterialAvatar 사용 -->
      <div class="row mt-4">
        <div class="col-12 col-xl-4" v-for="(user, index) in conversations" :key="index">
          <material-avatar
            :img="user.image"
            alt="user"
            border-radius="lg"
            shadow="regular"
          />
          <div class="ms-2">
            <h6 class="mb-0">{{ user.name }}</h6>
            <p class="text-sm">{{ user.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useConfigStore } from "@/store/index"; // 🔥 Pinia 스토어 가져오기
import ProfileInfoCard from "./components/ProfileInfoCard.vue";
import DefaultProjectCard from "./components/DefaultProjectCard.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialAvatar from "@/components/MaterialAvatar.vue";

import sophie from "@/assets/img/kal-visuals-square.jpg";
import marie from "@/assets/img/marie.jpg";
import ivana from "@/assets/img/ivana-square.jpg";
import peterson from "@/assets/img/team-4.jpg";
import nick from "@/assets/img/team-3.jpg";
import img1 from "@/assets/img/home-decor-1.jpg";
import img2 from "@/assets/img/home-decor-2.jpg";
import img3 from "@/assets/img/home-decor-3.jpg";
import team1 from "@/assets/img/team-1.jpg";
import team2 from "@/assets/img/team-2.jpg";
import team3 from "@/assets/img/team-3.jpg";
import team4 from "@/assets/img/team-4.jpg";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";

export default {
  name: "profile-overview",
  components: {
    ProfileInfoCard,
    DefaultProjectCard,
    MaterialSwitch,
    MaterialAvatar,
  },
  data() {
    return {
      store: useConfigStore(), // 🔥 store 변수 안에 Pinia 스토어 담음
      showMenu: false,
      sophie,
      marie,
      ivana,
      peterson,
      nick,
      img1,
      img2,
      img3,
      team1,
      team2,
      team3,
      team4,
      conversations: [
        { name: "Sophie B.", message: "Hi! I need more information..", image: sophie },
        { name: "Anne Marie", message: "Awesome work, can you..", image: marie },
        { name: "Ivanna", message: "About files I can..", image: ivana },
        { name: "Peterson", message: "Have a great afternoon..", image: peterson },
        { name: "Nick Daniel", message: "Hi! I need more information..", image: nick },
      ],
    };
  },
  mounted() {
    this.store.isAbsolute = true;
    setNavPills();
    setTooltip();
  },
  beforeUnmount() {
    this.store.isAbsolute = false;
  },
};
</script>
