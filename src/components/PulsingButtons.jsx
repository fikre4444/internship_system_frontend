import BouncyButton from "./BouncyButton"
import NotificationButton from "./NotificationButton"

const PulsingButtons = () => {
  return (
    <div className="absolute top-2 right-2">
      <div className="flex gap-1">
        <BouncyButton />
        <NotificationButton />
      </div>
    </div>
  )
}

export default PulsingButtons
