<template>
    <div class="wrapper">
        <div class="gradient">
            <div class="container">
                <h1>401</h1>
                <h3 class="text-white">Unauthorized Access</h3>
                <h2 class="mb-0 mt-4 text-white">You do not have the Permission To access This Page </h2>
                <p class="mt-2 text-white">Please Contact to the Admin</p>
                <button class="btn bg-white text-primary d-inline-flex align-items-center" @click="goBack()">Back to
                    Home</button>
            </div>
            <div class="box">
                <div class="c xl-circle">
                    <div class="c lg-circle">
                        <div class="c md-circle">
                            <div class="c sm-circle">
                                <div class="c xs-circle">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const goBack = () =>{
    const router = useRouter();
    router.go(-1);
}

</script>