import {
  getDatabase,
  ref,
  child,
  push,
  update,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { nowWithoutTime } from "../utils/date";
import { streakByDay } from "../utils/habitUtils";

const users = "/users/";

export const updateTask = (task: any) => {
  const db = getDatabase();
  const auth = getAuth();
  const path = users + auth.currentUser?.uid + "/tasks/";
  if (!task.id) {
    const newKey = push(child(ref(db), path)).key;
    task.id = newKey;
  }

  let updates: { [k: string]: any } = {};
  updates[path + task.id] = task;
  console.log(updates);
  return update(ref(db), updates);
};

export const removeTask = (task: any) => {
  const db = getDatabase();
  const auth = getAuth();
  const path = users + auth.currentUser?.uid + "/tasks/";

  if (task.id) {
    remove(ref(db, path + task.id));
  }
};

export const updateHabit = (task: any) => {
  const db = getDatabase();
  const auth = getAuth();
  const path = users + auth.currentUser?.uid + "/habits/";
  if (!task.id) {
    const newKey = push(child(ref(db), path)).key;
    task.id = newKey;
  }

  let updates: { [k: string]: any } = {};
  updates[path + task.id] = task;
  console.log(updates);
  return update(ref(db), updates);
};

export const removeHabit = (task: any) => {
  const db = getDatabase();
  const auth = getAuth();
  const path = users + auth.currentUser?.uid + "/habits/";

  if (task.id) {
    remove(ref(db, path + task.id));
  }
};

export const calcExecutedForTask = async (
  userInfo: any,
  task: any,
  newState: boolean
) => {
  let exp = 0;
  if (newState) {
    let exist = false;
    Object.keys(userInfo?.executed).map(async (key, index) => {
      let ex = userInfo.executed[key];
      if (
        ex.caseId === task.id &&
        ex.typeCase === "com.example.strile.data_firebase.models.Task" &&
        ex.dateComplete === nowWithoutTime()
      ) {
        exist = true;
      }
    });
    if (!exist) {
      exp = 10 * (task.difficulty + 1);
      let executed = {
        caseId: task.id,
        dateComplete: Date.now(),
        experience: exp,
        name: task.name,
        typeCase: "com.example.strile.data_firebase.models.Task",
      };
      await updateUser(addExperience(exp, userInfo));
      await updateExecuted(executed);
    }
  } else {
    let executed: any[] = [];
    Object.keys(userInfo?.executed).map(async (key, index) => {
      let ex = userInfo.executed[key];
      if (
        ex.caseId === task.id &&
        ex.typeCase === "com.example.strile.data_firebase.models.Task"
      ) {
        executed.push(ex);
        exp -= 10 * (task.difficulty + 1);
      }
    });
    console.log(exp);
    await updateUser(addExperience(exp, userInfo));
    executed.forEach(async (e) => await removeExecuted(e));
  }
};

export const calcExecutedForHabit = async (
  userInfo: any,
  habit: any,
  newState: boolean
) => {
  let exp = 0;
  let day = Date.now();
  if (newState) {
    let exist = false;
    Object.keys(userInfo?.executed).map(async (key, index) => {
      let ex = userInfo.executed[key];
      if (
        ex.caseId === habit.id &&
        ex.typeCase === "com.example.strile.data_firebase.models.Habit" &&
        ex.dateComplete === nowWithoutTime()
      ) {
        exist = true;
      }
    });
    if (!exist) {
      exp =
        ((streakByDay(habit, new Date(day)) + 1) * (habit.difficulty + 1)) / 2;
      let executed = {
        caseId: habit.id,
        dateComplete: Date.now(),
        experience: exp,
        name: habit.name,
        typeCase: "com.example.strile.data_firebase.models.Habit",
      };
      await updateUser(addExperience(exp, userInfo));
      await updateExecuted(executed);
    }
  } else {
    let executed: any[] = [];
    Object.keys(userInfo?.executed).map(async (key, index) => {
      let ex = userInfo.executed[key];
      if (
        ex.caseId === habit.id &&
        ex.typeCase === "com.example.strile.data_firebase.models.Habit" &&
        ex.dateComplete >= nowWithoutTime()
      ) {
        executed.push(ex);
        exp -=
          (-1 *
            (streakByDay(habit, new Date(day)) + 2) *
            (habit.difficulty + 1)) /
          2;
      }
    });
    console.log(exp);
    await updateUser(addExperience(exp, userInfo));
    executed.forEach(async (e) => await removeExecuted(e));
  }
};

const addExperience = (experience: number, user: any) => {
  let totalExp = experience + user.experience;
  let goalExp = user.goalExperience;
  if (totalExp < goalExp) {
    user.experience = Math.max(totalExp, 0);
  } else {
    let level = user.level;
    while (totalExp >= goalExp) {
      level++;
      totalExp -= goalExp;
      goalExp = (goalExp * 3) / 2;
    }
    user.experience = totalExp;
    user.goalExperience = goalExp;
    user.level = level;
  }
  let date = user.dateLastActiveDay;
  let currentDate = nowWithoutTime();
  if (date < currentDate) {
    user.dateLastActiveDay = currentDate;
  }

  return user;
};

export const updateUser = async (user: any) => {
  const db = getDatabase();
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const path = users;

  user = user || {};
  user.dateLastActiveDay = user.dateLastActiveDay || 0;
  user.experience = user.experience || 0;
  user.goalExperience = user.goalExperience || 100;
  user.id = user.id || uid;
  user.level = user.level || 0;

  let updates: { [k: string]: any } = {};
  updates[path + "/" + uid] = user;
  console.log(updates);
  return await update(ref(db), updates);
};

export const updateExecuted = async (executed: any) => {
  const db = getDatabase();
  const auth = getAuth();
  const path = users + auth.currentUser?.uid + "/executed/";
  if (!executed.id) {
    const newKey = push(child(ref(db), path)).key;
    executed.id = newKey;
  }

  let updates: { [k: string]: any } = {};
  updates[path + executed.id] = executed;
  console.log(updates);
  return await update(ref(db), updates);
};

export const removeExecuted = async (executed: any) => {
  const db = getDatabase();
  const auth = getAuth();
  const path = users + auth.currentUser?.uid + "/executed/";

  if (executed.id) {
    await remove(ref(db, path + executed.id));
  }
};
