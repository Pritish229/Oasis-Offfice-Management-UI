<template>
    <div class="container mt-5">
        <div class="card p-4">
            <Form @submit="handleSubmit">
                <BASEINPUT name="email" label="Email Address" rules="required|email" type="email" :isRequired="true" />
                <BASEINPUT name="password" label="Password" rules="required" type="password" />

                <button type="submit" class="btn btn-primary mt-2">Submit</button>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { Form, configure, defineRule } from 'vee-validate';
import { required, email } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import BASEINPUT from '@/components/Controls/BASEINPUT.vue';

defineRule('required', required);
defineRule('email', email);

configure({
    validateOnInput: true,
    generateMessage: localize('en', {
        messages: {
            required: 'This field is required.',
            email: 'Please enter a valid email address.',
        }
    })
});

const handleSubmit = (values) => {
    console.log('Form values:', values);
};
</script>
