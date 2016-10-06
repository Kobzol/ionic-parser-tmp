import {Injectable} from "@angular/core";
import {LocalNotifications, Notification, Vibration} from "ionic-native";
import _ from "lodash";
import moment from "moment";

import {UserStorage} from "../storage/user-storage";
import {FoodGroup} from "../orders/food-group";
import {Food} from "../orders/food";
import {StravneS5Adapter} from "../ws/stravne-s5-adapter";
import {PlatformManager} from "../util/platform-manager";
import {TodayLunchAlertOptions} from "./alert-options";

declare var wakeuptimer: any;  // TODO

@Injectable()
export class TodayLunchService
{
    private static NOTIFICATION_ID_CHECK: number = 0;
    private static NOTIFICATION_ID_LUNCH: number = 1;

    constructor(private userStorage: UserStorage,
                private adapter: StravneS5Adapter,
                private platformManager: PlatformManager)
    {

    }

    public initialize()
    {
        if (!this.platformManager.isBrowser())
        {
            LocalNotifications.on("trigger", (notification: Notification) =>    // TODO: unsubscribe?
            {
                if (notification.id === TodayLunchService.NOTIFICATION_ID_CHECK)
                {
                    LocalNotifications.clear(notification.id);
                    LocalNotifications.cancel(notification.id);
                    this.onCheckTrigger();
                }
                else if (notification.id === TodayLunchService.NOTIFICATION_ID_LUNCH)
                {
                    this.onLunchNotificationTrigger();
                }
            });
            this.reschedule();
        }
    }

    public reschedule()
    {
        let date: Date = this.getNextScheduledDate(this.userStorage.todayLaunchTime);

        console.log("TL: scheduling next notification at " + date.toString());

        LocalNotifications.cancel(TodayLunchService.NOTIFICATION_ID_CHECK);
        LocalNotifications.schedule({   // TODO: change for simple alarm?
            id: TodayLunchService.NOTIFICATION_ID_CHECK,
            at: date,
            sound: null
        });
    }

    private getNextScheduledDate(time: string): Date
    {
        let hour = Number(time.split(":")[0]);
        let minute = Number(time.split(":")[1]);

        let now: Date = new Date();
        let targetTime: Date = new Date();
        targetTime.setHours(hour);
        targetTime.setMinutes(minute);
        targetTime.setSeconds(0);
        targetTime.setMilliseconds(0);

        if (targetTime < now)
        {
            targetTime.setDate(targetTime.getDate() + 1);
        }

        return targetTime;
    }

    private onCheckTrigger()
    {
        this.reschedule();

        console.log("TL: checking if enabled");
        if (!this.userStorage.todayLaunchEnabled)
        {
            return;
        }

        console.log("TL: enabled");

        let group: FoodGroup = this.getTodayFoodGroup();
        if (group === null)
        {
            return;
        }

        console.log("TL: found food group " + JSON.stringify(group));

        let food: Food = this.findOrderedFood(group);
        if (food === null)
        {
            return;
        }

        console.log("TL: found food " + JSON.stringify(food));

        this.showFoodNotification(food);
    }

    private onLunchNotificationTrigger()
    {
        let options: TodayLunchAlertOptions = this.userStorage.todayLaunchAlertOptions;

        if (options.vibrate)
        {
            Vibration.vibrate([500, 500, 500]);
        }
    }

    private findOrderedFood(group: FoodGroup): Food
    {
        let food: Food = _.find(group.foods, (food: Food) => food.isOrdered() && !food.isSoup());
        return food === undefined ? null : food;
    }

    private showFoodNotification(food: Food)
    {
        let options: TodayLunchAlertOptions = this.userStorage.todayLaunchAlertOptions;

        LocalNotifications.schedule({
            id: TodayLunchService.NOTIFICATION_ID_LUNCH,
            title: "Strava5.cz",
            text: food.name,
            at: null,
            sound: options.sound ? "res://platform_default" : null,
            icon: "res://notifikacni_ikona",
            led: "0000FF"
        });
    }

    private getTodayFoodGroup(): FoodGroup
    {
        let foods: FoodGroup[] = this.adapter.deserializeOrdersObject(this.userStorage.storedOrders);
        let group: FoodGroup = _.find(foods, (group: FoodGroup) => moment(group.date).isSame(moment(), "day"));

        return group === undefined ? null : group;
    }
}
