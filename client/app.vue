<template>
    <div>
        <NuxtRouteAnnouncer />
        <NuxtWelcome />
    </div>
</template>

<script lang="ts" setup>
import type { Query } from "./types/graphql";
const query = gql`
    query {
        users {
            id
            username
        }
    }
`;

const { data, error } = await useAsyncQuery<Query["users"]>(query);

console.log("data", data.value);
console.log("error", error.value);
</script>
