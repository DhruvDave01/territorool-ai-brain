<table>
<tr>
    <td colspan="2">@if(!empty($demo->firstName))Hi {{ $demo->firstName }},@else Hi,@endif</td>
</tr>
<tr>
    <td colspan="2">
        @php
            $seg = $demo->segment ?? 'C';
            $fn = e($demo->firstName ?? 'there');
            $cal = e(config('onboarding_segment_email.calendly_walkthrough_url', 'https://calendly.com/territool/territool-zoom'));
            $mobileApp = e(config('onboarding_segment_email.mobile_app_url', 'https://territool.com/app'));
            $replace = ['firstName' => $fn, 'calendlyUrl' => $cal, 'mobileAppUrl' => $mobileApp];
            if ($seg === 'A') {
                $ch = (isset($demo->registrationChannel) && $demo->registrationChannel === 'mobile') ? 'mobile' : 'web';
                $key = 'onboarding_segment_email.body.A_' . $ch;
            } else {
                $key = 'onboarding_segment_email.body.' . $seg;
            }
            $html = trans($key, $replace);
            if ($html === $key) {
                $html = trans('onboarding_segment_email.body.C', $replace);
            }
        @endphp
        {!! $html !!}
    </td>
</tr>
<tr><td>--</td></tr>
<tr>
    <td colspan="2">
        <img src="{{ config('app.url') }}images/logo_blue.png" alt="TerriTool" style="max-width:160px;height:auto;display:block;margin-bottom:12px;" />
    </td>
</tr>
<tr>
    <td>Spencer</td>
</tr>
<tr>
    <td>
        <a href="mailto:spencer@territool.com">spencer@territool.com</a>&nbsp;|&nbsp;<a href="tel:+19492742520">(949) 274-2520</a>
        <br>
        <a href="https://territool.com/app" target="_blank" rel="noopener">territool.com/app</a>
    </td>
</tr>
</table>
