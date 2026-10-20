<template>
  <UILink to="/auth" renderless :hoverable="false">
    <UIButton
      tag="span"
      size="large"
      prepend-icon="mingcute:entrance-fill"
      prepend-icon-class="rotate-180"
      :full="full"
    >
      Войти
    </UIButton>
  </UILink>
</template>

<script setup lang="ts">
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UILink from '~/components/ui/UILink.vue';

withDefaults(defineProps<{ full?: boolean }>(), { full: false });
</script>
