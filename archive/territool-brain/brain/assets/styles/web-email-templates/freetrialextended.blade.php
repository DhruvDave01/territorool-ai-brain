@extends('mails.layoutroute')
@section('body')

<tr>
	<td colspan="2">Hello {{$demo->name}},</td>
</tr>
<tr>
    <td colspan="2">Your 1 week trial extension for TerriTool has been approved. Follow our interactive onboarding feature to add and route companies and/or contacts.</td>
</tr>
<tr>
    <td colspan="2"><strong>Web Portal: </strong><a href="https://app.territool.com">https://app.territool.com</a></td>
</tr>
<tr>
    <td colspan="2"><strong>IPhone: </strong><a href="https://apps.apple.com/lu/app/territool-app/id1399506362">https://apps.apple.com/lu/app/territool-app/id1399506362</a></td>
</tr>
<tr>
    <td colspan="2"><strong>Android: </strong><a href="https://play.google.com/store/apps/details?id=com.picwa.territoolapp&hl=en_IN">https://play.google.com/store/apps/details?id=com.picwa.territoolapp&hl=en_IN</a></td>
</tr>
<tr>
    <td colspan="2">Feel free to schedule a one-on-one zoom call using the link below or email support@territool.com for assistance.</td>
</tr>
<tr>
    <td colspan="2"><a href="https://calendly.com/territool/territool-zoom">https://calendly.com/territool/territool-zoom</a></td>
</tr>
<tr>
    <td colspan="2">--</td>
</tr>
<tr>
    <td colspan="2">
        Spencer Kelleher<br/>
        (949) 274-5011<br/>
        spencer@territool.com
    </td>
</tr>

@endsection