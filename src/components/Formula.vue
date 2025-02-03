<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { FaExclamationCircle, FaQuestionCircle } from "vue3-icons/fa";
import { TFormula, TNumberInputState } from "../common/type";
// import { enforceMinMaxWithInputEvent } from "../helpers/valueEnforcer";
import InputInstantNumber from "./common/InputInstantNumber.vue";
import enforceMinMax from "../helpers/valueEnforcer";

const durations = reactive({
  hours: 4,
  days: 20,
  annualLeave: 20,
});

const hoursInputState = ref<TNumberInputState>("empty");
const daysInputState = ref<TNumberInputState>("empty");
// TODO: Fix
const annualLeaveInputState = ref<TNumberInputState>("valid");

// const annualLeaveTemp = ref(durations.annualLeave);
const isExplanationShown = ref<boolean>(false);

const props = defineProps<{
  updateFormula: (formula: TFormula) => void;
}>();

onMounted(() =>
  props.updateFormula({
    hours: durations.hours,
    days: durations.days,
    annualLeave: durations.annualLeave,
  })
);

// LIMITS
const hoursMin = 1;
const hoursMax = 24;
const daysMin = 1;
const daysMax = 30;
const annualLeaveMin = computed(() => 30 - durations.days + 1);
const annualLeaveMax = computed(() => 365 - durations.days * 12);
const isAnnualLeaveAllowEmpty = true;

// const isAnnualLeaveInvalid = computed(
//   () =>
//     //TODO: might be better if used === 0 possibility
//     annualLeaveMin.value > durations.annualLeave &&
//     durations.annualLeave < annualLeaveMax.value
// );

// const annualLeaveInputState = computed<"small" | "big" | "valid">(() => {
//   if (annualLeaveTemp.value < annualLeaveMin() && annualLeaveTemp.value > 0)
//     return "small";
//   if (annualLeaveTemp.value > annualLeaveMax()) return "big";

//   return "valid";
// });

const hoursTooltips = (): string => {
  switch (hoursInputState.value) {
    case "valid":
    case "empty":
      return `How many hours do you work in a day?`;
    case "small":
      return `Value is too low, it should be min ${hoursMin}`;
    case "big":
      return `Value is too high, it should be max ${hoursMax}`;
  }
};

const daysTooltips = (): string => {
  switch (daysInputState.value) {
    case "valid":
    case "empty":
      return `How many days do you work in a month?`;
    case "small":
      return `Value is too low, it should be min ${daysMin}`;
    case "big":
      return `Value is too high, it should be max ${daysMax}`;
  }
};

durations.annualLeave = 12;

const annualLeaveTooltips = (): string => {
  switch (annualLeaveInputState.value) {
    case "valid":
    case "empty":
      return `How many days you don\'t work in a year?`;
      return `How many days you don\'t work in a year?
        (min: ${annualLeaveMin.value} (30 - ${durations.days} + 1) | max: ${annualLeaveMax.value} (365 - ${durations.days} days x 12 months)`;
    case "small":
      return `Annual leave is irrelevant because you work less in a month (${durations.days})
            than your annual leave (${durations.annualLeave}). It will be calculated as min value (${annualLeaveMin.value})`;
    case "big":
      return `Annual leave ${durations.annualLeave} is too much when you have ${
        durations.days * 12
      } (days x 12) it will be considered as max value (${
        annualLeaveMax.value
      })`;
  }
};

//#region HANDLE
// const handleOnInput = ($event: Event, duration: keyof typeof durations) => {
//   switch (duration) {
//     case "hours":
//       durations.hours = enforceMinMaxWithInputEvent($event, hoursMin, hoursMax);
//       break;
//     case "days":
//       durations.days = enforceMinMaxWithInputEvent($event, daysMin, daysMax);
//       durations.annualLeave = enforceMinMaxWithInputEvent(
//         $event,
//         annualLeaveMin(),
//         annualLeaveMax(),
//         true
//       );
//       break;
//   }
// };

// Handles the input for annual leave and updates the duration if the input is valid.
// const handleOnAnnualLeaveInput = () => {
//   annualLeaveInputState.value === "valid" &&
//     (durations.annualLeave = annualLeaveTemp.value);
// };

// const handleOnChange = ($event: Event, duration: keyof typeof durations) => {
//   switch (duration) {
//     case "annualLeave":
//       durations.annualLeave = enforceMinMaxWithInputEvent(
//         $event,
//         annualLeaveMin(),
//         annualLeaveMax(),
//         true
//       );
//       break;
//   }
// };
//#endregion

// Function to get hours, fallback to 4 if falsy
const getHours = () => durations.hours ?? 4;

// Function to get days, fallback to 20 if falsy
const getDays = () => durations.days ?? 20;

// Function to get annualLeave, fallback to 20 if falsy
const getAnnualLeave = () =>
  annualLeaveInputState.value ? 0 : durations.annualLeave;

watch(durations, () =>
  props.updateFormula({
    hours: durations.hours,
    days: durations.days,
    annualLeave: durations.annualLeave,
  })
);

watch([annualLeaveMin, annualLeaveMax], () => {
  durations.annualLeave = enforceMinMax(
    durations.annualLeave,
    annualLeaveMin.value,
    annualLeaveMax.value,
    true
  );
});
</script>

<template>
  <div class="font-mono">
    <div class="flex flex-wrap justify-center gap-5">
      <div class="card">
        <div
          :class="{
            'tooltip tooltip-right sm:tooltip-top tooltip-info font-sans font-light':
              hoursInputState === 'valid',
            'tooltip tooltip-right sm:tooltip-top tooltip-warning font-sans font-light':
              hoursInputState !== 'valid',
          }"
          :data-tip="`${hoursTooltips()}`"
        >
          <label for="hours" class="label-custom"
            >{{ durations.hours === 1 ? "Hour" : "Hours" }}
            <FaQuestionCircle
              v-if="hoursInputState === 'valid'"
              class="tooltip-icon"
            />
            <FaExclamationCircle
              v-else
              class="text-[10px] align-middle sm:text-xs inline text-warning"
            />
          </label>
        </div>
        <InputInstantNumber
          id="hours"
          :originalValue="durations.hours"
          v-model.number="durations.hours"
          v-model:input-state="hoursInputState"
          :min="hoursMin"
          :max="hoursMax"
          :allow-empty="false"
          valid-class="input input-bordered input-sm w-24 input-accent self-center"
          invalid-class="input input-bordered input-sm w-24 input-warning"
        />
        <div class="text-[8px] sm:text-[10px] mt-2">
          {{ `Min:${hoursMin} - Max:${hoursMax}` }}
        </div>
      </div>
      <!-- DAYS -->
      <div class="card">
        <div
          :class="{
            'tooltip tooltip-top tooltip-info font-sans font-light':
              daysInputState === 'valid',
            'tooltip tooltip-top tooltip-warning font-sans font-light':
              daysInputState !== 'valid',
          }"
          :data-tip="`${daysTooltips()}`"
        >
          <label for="days" class="label-custom"
            >{{ durations.days === 1 ? "Day" : "Days" }}
            <FaQuestionCircle
              v-if="daysInputState === 'valid'"
              class="tooltip-icon"
            />
            <FaExclamationCircle
              v-else
              class="text-[10px] align-middle sm:text-xs inline text-warning"
            />
          </label>
        </div>
        <InputInstantNumber
          id="days"
          :originalValue="durations.days"
          v-model.number="durations.days"
          v-model:input-state="daysInputState"
          :min="daysMin"
          :max="daysMax"
          :allow-empty="false"
          valid-class="input input-bordered input-sm w-24 input-accent self-center"
          invalid-class="input input-bordered input-sm w-24 input-warning"
        />
        <div class="text-[8px] sm:text-[10px] mt-2">
          {{ `Min:${daysMin} - Max:${daysMax}` }}
        </div>
      </div>
      <div class="card">
        <div
          :class="{
            'tooltip tooltip-left sm:tooltip-top tooltip-info font-sans font-light':
              annualLeaveInputState === 'valid',
            'tooltip tooltip-left sm:tooltip-top tooltip-warning font-sans font-light':
              annualLeaveInputState !== 'valid',
          }"
          :data-tip="`${annualLeaveTooltips()}`"
        >
          <label for="annual-leave" class="label-custom">
            {{ durations.annualLeave === 1 ? "Day Off" : "Days Off" }}
            <FaQuestionCircle
              v-if="annualLeaveInputState === 'valid'"
              class="tooltip-icon"
            />
            <FaExclamationCircle
              v-else
              class="text-[10px] align-middle sm:text-xs inline text-warning"
            />
          </label>
        </div>
        <InputInstantNumber
          id="annual-leave"
          :originalValue="durations.annualLeave"
          v-model.number="durations.annualLeave"
          v-model:input-state="annualLeaveInputState"
          :min="annualLeaveMin"
          :max="annualLeaveMax"
          :allow-empty="true"
          valid-class="input input-bordered input-sm w-24 input-accent self-center"
          invalid-class="input input-bordered input-sm w-24 input-warning"
        />
        <div class="text-[8px] sm:text-[10px] mt-2">
          {{ `Min:${annualLeaveMin} - Max:${annualLeaveMax}` }}
        </div>
      </div>

      <!-- <div class="card">
        <div
          class="tooltip tooltip-right sm:tooltip-top tooltip-info font-sans font-light"
          :data-tip="`How many hours do you work in a day?`"
        >
          <label for="hours" class="label-custom"
            >{{ durations.hours === 1 ? "Hour" : "Hours" }}
            <FaQuestionCircle class="tooltip-icon" />
          </label>
        </div>
        <input
          id="hours"
          v-model="durations.hours"
          @input="handleOnInput($event, 'hours')"
          class="input input-bordered input-sm w-24 input-accent"
        />
        <div class="text-[8px] sm:text-[10px] mt-2">
          {{ `Min:${hoursMin} - Max:${hoursMax}` }}
        </div>
      </div> -->
      <!-- <div class="card">
        <div
          class="tooltip tooltip-top tooltip-info font-sans font-light"
          :data-tip="`How many days do you work in a month?`"
        >
          <label for="days" class="label-custom"
            >{{ durations.days === 1 ? "Day" : "Days" }}
            <FaQuestionCircle class="tooltip-icon" />
          </label>
        </div>
        <input
          id="days"
          v-model="durations.days"
          @input="handleOnInput($event, 'days')"
          class="input input-bordered input-sm w-24 input-accent"
        />
        <div class="text-[8px] sm:text-[10px] mt-2">
          {{ `Min:${daysMin} - Max:${daysMax}` }}
        </div>
      </div> -->
      <!-- <div class="card">
        <div
          :class="{
            'tooltip tooltip-left sm:tooltip-top tooltip-info font-sans font-light':
              annualLeaveInputState === 'valid',
            'tooltip tooltip-left tooltip-warning font-sans font-light':
              annualLeaveInputState !== 'valid',
          }"
          :data-tip="`${annualLeaveTooltips()}`"
        >
          <label for="annualLeave" class="label-custom">
            {{ durations.annualLeave === 1 ? "Day Off" : "Days Off" }}
            <FaQuestionCircle
              v-if="annualLeaveInputState === 'valid'"
              class="tooltip-icon"
            />
            <FaExclamationCircle
              v-else
              class="text-[10px] align-middle sm:text-xs inline text-warning"
            />
          </label>
        </div>
        <input
          id="annual-leave"
          v-model="annualLeaveTemp"
          @input="handleOnAnnualLeaveInput"
          @change="handleOnChange($event, 'annualLeave')"
          :class="{
            'input input-bordered input-sm w-24 input-accent self-center':
              annualLeaveInputState === 'valid',
            'input input-bordered input-sm w-24 input-warning':
              annualLeaveInputState !== 'valid',
          }"
        />
        <div class="text-[8px] sm:text-[10px] mt-2">
          {{ `Min:${annualLeaveMin()} - Max:${annualLeaveMax()}` }}
        </div>
      </div> -->
    </div>
    <!-- Explanation -->
    <div
      class="mx-4 sm:mx-10 md:mx-28 lg:mx-48"
      :class="{
        'my-4 sm:my-7': isExplanationShown,
        'mt-4 sm:mt-7': !isExplanationShown,
      }"
    >
      <button
        class="btn btn-warning btn-outline btn-xs mb-3 font-thin text-neutral-content"
        @click="isExplanationShown = !isExplanationShown"
      >
        Click to
        {{ isExplanationShown ? "hide explanation" : "show explanation" }}
      </button>

      <div
        class="flex flex-wrap justify-center transition-all duration-500 ease-in-out transform overflow-hidden"
        :class="{
          'max-h-60': isExplanationShown,
          'max-h-0': !isExplanationShown,
        }"
      >
        <div class="mx-auto text-start">
          <span class="font-bold">
            Hours=
            <span class="badge badge-warning">
              {{ getHours() }}
            </span>
            , Days=
            <span class="badge badge-warning"> {{ getDays() }} </span>, Annual
            leaves=
            <span class="badge badge-warning">
              {{ getAnnualLeave() }}
            </span>
          </span>
          <h4>
            <span class="badge badge-secondary font-bold">
              {{ getHours() }} x {{ getDays() }} x 12
              <template v-if="getAnnualLeave() >= 1">
                - ({{ getAnnualLeave() }} x {{ getHours() }})
              </template>
            </span>
            =
            <span class="badge badge-secondary font-bold"
              >{{
                getHours() * getDays() * 12 - getHours() * getDays()
              }}
              hours</span
            >
            =
            <span class="badge badge-secondary font-bold"
              >{{ getDays() * 12 }} days</span
            >
            =
            <span class="badge badge-secondary font-bold"
              >{{ (getDays() * 12) / 30 }} months</span
            >
            =
            <span class="badge badge-secondary font-bold"
              >{{ Math.floor(((getDays() * 12) / 30) * 4.3) }} weeks</span
            >
            (4.3 weeks in a month) = in a year.
          </h4>

          <h4 class="font-light mt-5">
            Which means if you make
            <span class="badge badge-accent font-bold">$10/hour</span>, you will
            be making:
            <span class="badge badge-accent font-bold"
              >${{ getHours() * 10 }}/day</span
            >,
            <span class="badge badge-accent font-bold"
              >${{ getHours() * getDays() * 10 }}/month</span
            >,
            <span class="badge badge-accent font-bold">
              ${{ getHours() * getDays() * 10 * 12 }} - ${{
                getHours() * getAnnualLeave() * 10
              }}
            </span>
            (annual leave) = total income of
            <span class="badge badge-accent font-bold">
              ${{
                getHours() * getDays() * 10 * 12 -
                getHours() * getAnnualLeave() * 10
              }}/year
            </span>
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.label-custom {
  @apply flex items-center justify-center gap-x-1 font-bold text-xs sm:text-base mb-1;
}

.tooltip:before {
  @apply max-w-40 sm:max-w-60;
}

.tooltip-icon {
  @apply text-[10px] align-middle sm:text-xs inline hover:text-info;
}
</style>
