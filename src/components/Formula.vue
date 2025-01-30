<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { FaExclamationCircle, FaQuestionCircle } from "vue3-icons/fa";
import { TFormula } from "../common/type";
import { enforceMinMaxWithInputEvent } from "../helpers/valueEnforcer";

const durations = reactive({
  hours: 4,
  days: 20,
  annualLeave: 20,
});
const annualLeaveTemp = ref(durations.annualLeave);
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
const annualLeaveMin = () => 30 - durations.days + 1;
const annualLeaveMax = () => 365 - durations.days * 12;

const isAnnualLeaveInvalid = computed(
  () =>
    //TODO: might be better if used === 0 possibility
    annualLeaveMin() > durations.annualLeave &&
    durations.annualLeave < annualLeaveMax()
);

const annualLeaveInputState = computed<"small" | "big" | "valid">(() => {
  if (annualLeaveTemp.value < annualLeaveMin() && annualLeaveTemp.value > 0)
    return "small";
  if (annualLeaveTemp.value > annualLeaveMax()) return "big";

  return "valid";
});

const annualLeaveTooltips = (): string => {
  switch (annualLeaveInputState.value) {
    case "valid":
      return `How many days you don\'t work in a year?
        (min: ${annualLeaveMin()} (30 - ${
        durations.days
      } + 1) | max: ${annualLeaveMax()} (365 - ${
        durations.days
      } days x 12 months)`;
    case "small":
      return `Annual leave is irrelevant because you work less in a month (${
        durations.days
      })
            than your annual leave (${
              durations.annualLeave
            }). It will be calculated as min value (${annualLeaveMin()})`;
    case "big":
      return `Annual leave ${annualLeaveTemp.value} is too much when you have ${
        durations.days * 12
      } (days x 12) it will be considered as max value (${annualLeaveMax()})`;
  }
};

//#region HANDLE
const handleOnInput = ($event: Event, duration: keyof typeof durations) => {
  switch (duration) {
    case "hours":
      durations.hours = enforceMinMaxWithInputEvent($event, hoursMin, hoursMax);
      break;
    case "days":
      durations.days = enforceMinMaxWithInputEvent($event, daysMin, daysMax);
      durations.annualLeave = enforceMinMaxWithInputEvent(
        $event,
        annualLeaveMin(),
        annualLeaveMax(),
        true
      );
      break;
  }
};

// Handles the input for annual leave and updates the duration if the input is valid.
const handleOnAnnualLeaveInput = () => {
  annualLeaveInputState.value === "valid" &&
    (durations.annualLeave = annualLeaveTemp.value);
};

const handleOnChange = ($event: Event, duration: keyof typeof durations) => {
  switch (duration) {
    case "annualLeave":
      durations.annualLeave = enforceMinMaxWithInputEvent(
        $event,
        annualLeaveMin(),
        annualLeaveMax(),
        true
      );
      break;
  }
};
//#endregion

// Function to get hours, fallback to 4 if falsy
const getHours = () => durations.hours ?? 4;

// Function to get days, fallback to 20 if falsy
const getDays = () => durations.days ?? 20;

// Function to get annualLeave, fallback to 20 if falsy
const getAnnualLeave = () =>
  isAnnualLeaveInvalid.value ? 0 : durations.annualLeave;

watch(durations, () =>
  props.updateFormula({
    hours: durations.hours,
    days: durations.days,
    annualLeave: durations.annualLeave,
  })
);
</script>

<template>
  <div class="font-mono">
    <div class="flex flex-wrap justify-center gap-5">
      <div class="card">
        <label for="hours" class="font-bold mb-1"
          >{{ durations.hours === 1 ? "Hour" : "Hours" }}
          <div
            class="tooltip-custom"
            :data-tip="`How many hours do you work in a day? (min:${hoursMin} | max:${hoursMax})`"
          >
            <FaQuestionCircle class="text-xs inline hover:text-info" />
          </div>
        </label>
        <input
          id="hours"
          v-model="durations.hours"
          @input="handleOnInput($event, 'hours')"
          class="input input-bordered input-sm w-24 input-accent"
        />
      </div>
      <div class="card">
        <label for="days" class="font-bold mb-1"
          >{{ durations.days === 1 ? "Day" : "Days" }}
          <div
            class="tooltip-custom"
            :data-tip="`How many days do you work in a month? (min:${daysMin} | max:${daysMax})`"
          >
            <FaQuestionCircle class="text-xs inline hover:text-info" />
          </div>
        </label>
        <input
          id="days"
          v-model="durations.days"
          @input="handleOnInput($event, 'days')"
          class="input input-bordered input-sm w-24 input-accent"
        />
      </div>
      <div class="card">
        <label for="annualLeave" class="font-bold mb-1">
          {{ durations.annualLeave === 1 ? "Day Off" : "Days Off" }}
          <div
            :class="{
              'tooltip-custom': annualLeaveInputState === 'valid',
              'tooltip tooltip-top tooltip-warning font-sans font-light':
                annualLeaveInputState !== 'valid',
            }"
            :data-tip="`${annualLeaveTooltips()}`"
          >
            <FaQuestionCircle
              v-if="annualLeaveInputState === 'valid'"
              class="text-xs inline hover:text-info"
            />
            <FaExclamationCircle v-else class="text-xs inline text-warning" />
          </div>
        </label>
        <input
          id="annual-leave"
          v-model="annualLeaveTemp"
          @input="handleOnAnnualLeaveInput"
          @change="handleOnChange($event, 'annualLeave')"
          :class="{
            'input input-bordered input-sm w-24 input-accent':
              annualLeaveInputState === 'valid',
            'input input-bordered input-sm w-24 input-warning':
              annualLeaveInputState !== 'valid',
          }"
        />
      </div>
    </div>
    <!-- Explanation -->
    <div class="mt-7 mx-4 sm:mx-10 md:mx-28 lg:mx-36">
      <div class="collapse">
        <input
          type="checkbox"
          @change="isExplanationShown = !isExplanationShown"
        />
        <div class="collapse-title p-0">
          <span class="btn btn-warning btn-outline btn-xs rounded-md">
            <span class="font-thin text-neutral-content">
              Click to
              {{ isExplanationShown ? "hide explanation" : "show explanation" }}
            </span>
          </span>
        </div>
        <div class="collapse-content">
          <div class="flex flex-wrap justify-center">
            <div class="mx-auto text-start">
              <span class="font-bold">
                Hours=
                <span class="badge badge-warning">
                  {{ getHours() }}
                </span>
                , Days=
                <span class="badge badge-warning"> {{ getDays() }} </span>,
                Annual leaves=
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
                <span class="badge badge-accent font-bold">$10/hour</span>, you
                will be making:
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
    </div>
  </div>
</template>

<style scoped>
.tooltip-custom {
  @apply tooltip tooltip-top tooltip-info font-sans font-light;
}
</style>
